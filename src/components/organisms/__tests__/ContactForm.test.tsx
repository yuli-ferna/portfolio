import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ContactForm from '../ContactForm';

const ENDPOINT = 'https://api.web3forms.com/submit';

const jsonResponse = (body: unknown) => Promise.resolve({ json: () => Promise.resolve(body) } as Response);

function setup(lang = 'en') {
  const user = userEvent.setup();
  render(<ContactForm lang={lang} />);
  const name = screen.getByLabelText('Name') as HTMLInputElement;
  const email = screen.getByLabelText('Email') as HTMLInputElement;
  const message = screen.getByLabelText('Message') as HTMLTextAreaElement;
  const submit = screen.getByRole('button', { name: 'Submit message' });
  const fillValid = async () => {
    await user.type(name, 'Ana Pérez');
    await user.type(email, 'ana@example.com');
    await user.type(message, 'Hola!');
  };
  return { user, name, email, message, submit, fillValid };
}

describe('ContactForm', () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  describe('rendering', () => {
    it('renders translated labels in English', () => {
      setup('en');
      expect(screen.getByRole('heading', { name: 'Contact Form' })).toBeInTheDocument();
      expect(screen.getByLabelText('Name')).toHaveAttribute('name', 'name');
      expect(screen.getByLabelText('Email')).toHaveAttribute('name', 'email');
      expect(screen.getByLabelText('Message')).toHaveAttribute('name', 'message');
    });

    it('renders translated labels in Spanish', () => {
      render(<ContactForm lang="es" />);
      expect(screen.getByRole('heading', { name: 'Formulario de Contacto' })).toBeInTheDocument();
      expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
      expect(screen.getByLabelText('Mensaje')).toBeInTheDocument();
    });

    it('marks every field as required', () => {
      const { name, email, message } = setup();
      [name, email, message].forEach((f) => expect(f).toBeRequired());
    });

    it('starts with empty fields and an enabled submit button', () => {
      const { name, email, message, submit } = setup();
      expect(name.value).toBe('');
      expect(email.value).toBe('');
      expect(message.value).toBe('');
      expect(submit).toBeEnabled();
    });
  });

  describe('validation', () => {
    it('flags a field as required when it is cleared', async () => {
      const { user, name, submit } = setup();
      await user.type(name, 'A');
      await user.clear(name);
      expect(screen.getByText('is required')).toBeInTheDocument();
      expect(submit).toBeDisabled();
    });

    it('flags a badly formatted email', async () => {
      const { user, email, submit } = setup();
      await user.type(email, 'not-an-email');
      expect(screen.getByText('wrong format')).toBeInTheDocument();
      expect(submit).toBeDisabled();
    });

    it.each(['ana@example.com', 'first.last@sub.domain.org', 'a-b_c@x.io'])(
      'accepts a valid email (%s)',
      async (value) => {
        const { user, email, submit } = setup();
        await user.type(email, value);
        expect(screen.queryByText('wrong format')).not.toBeInTheDocument();
        expect(submit).toBeEnabled();
      },
    );

    it('clears the error once the field becomes valid', async () => {
      const { user, email, submit } = setup();
      await user.type(email, 'ana@');
      expect(screen.getByText('wrong format')).toBeInTheDocument();
      await user.type(email, 'example.com');
      expect(screen.queryByText('wrong format')).not.toBeInTheDocument();
      expect(submit).toBeEnabled();
    });

    it('validates the message field', async () => {
      const { user, message } = setup();
      await user.type(message, 'x');
      await user.clear(message);
      expect(screen.getByText('is required')).toBeInTheDocument();
    });

    it('keeps errors of other fields when one field changes', async () => {
      const { user, name, email } = setup();
      await user.type(email, 'bad');
      await user.type(name, 'Ana');
      expect(screen.getByText('wrong format')).toBeInTheDocument();
    });
  });

  describe('submission', () => {
    it('posts the form to web3forms with the access key and a subject', async () => {
      fetchMock.mockImplementation(() => jsonResponse({ success: true }));
      const { user, submit, fillValid } = setup();
      await fillValid();
      await user.click(submit);

      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe(ENDPOINT);
      expect(init.method).toBe('POST');
      const body = init.body as FormData;
      expect(body.get('name')).toBe('Ana Pérez');
      expect(body.get('email')).toBe('ana@example.com');
      expect(body.get('message')).toBe('Hola!');
      expect(body.get('access_key')).toEqual(expect.any(String));
      expect(body.get('subject')).toBe('New message from portfolio -  Ana Pérez');
    });

    it('shows a success message and resets the form', async () => {
      fetchMock.mockImplementation(() => jsonResponse({ success: true }));
      const { user, submit, fillValid, name, email, message } = setup();
      await fillValid();
      await user.click(submit);

      expect(await screen.findByText('Message sent successfully!')).toBeInTheDocument();
      expect(name.value).toBe('');
      expect(email.value).toBe('');
      expect(message.value).toBe('');
      expect(submit).toBeEnabled();
    });

    it('disables the button while the request is in flight', async () => {
      let resolve!: (v: unknown) => void;
      fetchMock.mockReturnValue(new Promise((r) => (resolve = r)));
      const { user, submit, fillValid } = setup();
      await fillValid();
      await user.click(submit);
      expect(submit).toBeDisabled();
      resolve({ json: () => Promise.resolve({ success: true }) });
      await waitFor(() => expect(submit).toBeEnabled());
    });

    it('shows the API error message on failure and keeps the input', async () => {
      fetchMock.mockImplementation(() => jsonResponse({ success: false, message: 'Invalid access key' }));
      const { user, submit, fillValid, name } = setup();
      await fillValid();
      await user.click(submit);

      expect(await screen.findByText('Invalid access key')).toBeInTheDocument();
      expect(name.value).toBe('Ana Pérez');
      expect(submit).toBeEnabled();
    });

    it('shows a generic error when the API gives no message', async () => {
      fetchMock.mockImplementation(() => jsonResponse({ success: false }));
      const { user, submit, fillValid } = setup();
      await fillValid();
      await user.click(submit);
      expect(
        await screen.findByText('An error occurred while sending the message.'),
      ).toBeInTheDocument();
    });

    it('recovers from a network error instead of staying disabled', async () => {
      fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
      const { user, submit, fillValid } = setup();
      await fillValid();
      await user.click(submit);
      expect(
        await screen.findByText('An error occurred while sending the message.'),
      ).toBeInTheDocument();
      expect(submit).toBeEnabled();
    });

    it('recovers when the response is not JSON', async () => {
      fetchMock.mockReturnValue(
        Promise.resolve({ json: () => Promise.reject(new SyntaxError('Unexpected token <')) }),
      );
      const { user, submit, fillValid } = setup();
      await fillValid();
      await user.click(submit);
      expect(
        await screen.findByText('An error occurred while sending the message.'),
      ).toBeInTheDocument();
    });

    it('lets the user dismiss the result message', async () => {
      fetchMock.mockImplementation(() => jsonResponse({ success: true }));
      const { user, submit, fillValid } = setup();
      await fillValid();
      await user.click(submit);
      await screen.findByText('Message sent successfully!');

      const buttons = screen.getAllByRole('button');
      const close = buttons.find((b) => b.classList.contains('close'))!;
      await user.click(close);
      expect(screen.queryByText('Message sent successfully!')).not.toBeInTheDocument();
    });
  });
});

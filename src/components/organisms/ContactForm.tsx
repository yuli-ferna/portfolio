import { useState, useTransition, type FormEvent } from "react";
import { useTranslations } from "../../i18n/utils";

interface message {
  fullName: string;
  email: string;
  content: string;
}

const Contact = ({ lang }) => {
  const t = useTranslations(lang);
  const contact = t("contact") ?? {};

  const [message, setMessage] = useState<message>({
    fullName: "",
    email: "",
    content: "",
  });
  const [messageError, setMessageError] = useState<message>({
    fullName: "",
    email: "",
    content: "",
  });
  const [isFetching, setIsFetching] = useState(false);
  const [resultMessage, setResultMessage] = useState({
    isError: false,
    content: "",
  });

  const handleChange = (value: string, field: string) => {
    const regexEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    // Set Message
    setMessage({ ...message, [field]: value });
    // Validate
    if (value === "") {
      setMessageError({ ...messageError, [field]: "is required" });
      return;
    }
    // Format validation
    if (field === "email" && !regexEmail.test(value)) {
      setMessageError({ ...messageError, [field]: "wrong format" });
      return;
    }
    setMessageError({ ...messageError, [field]: "" });
  };

  const isValid = () =>
    !messageError.fullName && !messageError.email && !messageError.content;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    setIsFetching(true);
    //console.log("Submitting form", event.target, formData);

    formData.append("access_key", "16bba9b2-716e-4213-a979-3aa37ebe1b63");
    formData.append(
      "subject",
      `New message from portfolio -  ${message.fullName}`,
    );

    let data: { success?: boolean; message?: string };
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      data = await response.json();
    } catch {
      data = { success: false };
    }

    if (data.success) {
      //console.log("Success", data);
      setResultMessage({
        isError: false,
        content: "Message sent successfully!",
      });
      setMessage({
        fullName: "",
        email: "",
        content: "",
      });
      setMessageError({
        fullName: "",
        email: "",
        content: "",
      });
      setIsFetching(false);
    } else {
      //console.log("Error", data);
      setResultMessage({
        isError: true,
        content: data.message || "An error occurred while sending the message.",
      });
      setIsFetching(false);
    }
  };

  const close = () => {
    setResultMessage({
      isError: false,
      content: "",
    })
  };

  const fieldClass = (error: string) =>
    `px-field ${error ? "px-field-error" : ""}`;

  const errorIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="w-4 h-4 text-red-500"><path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd"></path></svg>
  );

  return (
    <div className="h-fit w-full">
      <form id="form" onSubmit={onSubmit} className="px-card px-form text-left" noValidate={false}>
        <div className="px-bar">
          <span className="px-dot px-dot-red" aria-hidden="true" /><span className="px-dot px-dot-yellow" aria-hidden="true" /><span className="px-dot px-dot-green" aria-hidden="true" />
          <h2 className="px-bar-title text-xs font-normal m-0">{contact["form"]}</h2>
        </div>
        <div className="px-form-body">
          <div className="px-form-row">
            {/* name */}
            <div className="px-label">
              <label htmlFor="name">{contact["name"]}</label>
              <span className={fieldClass(messageError.fullName)}>
                <input
                  id="name"
                  name="name"
                  placeholder={contact["name"]}
                  value={message.fullName}
                  onChange={(event) => handleChange(event.target.value, "fullName")}
                  required
                />
                {!!messageError.fullName && errorIcon}
              </span>
              <span className="px-error capitalize">
                {!!messageError.fullName && messageError.fullName}
              </span>
            </div>
            {/* email */}
            <div className="px-label">
              <label htmlFor="email">{contact["email"]}</label>
              <span className={fieldClass(messageError.email)}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={"email@gmail.com"}
                  value={message.email}
                  onChange={(event) => handleChange(event.target.value, "email")}
                  required
                />
                {!!messageError.email && errorIcon}
              </span>
              <span className="px-error capitalize">
                {!!messageError.email && messageError.email}
              </span>
            </div>
          </div>
          {/* message */}
          <div className="px-label">
            <label htmlFor="message">{contact["message"]}</label>
            <span className={fieldClass(messageError.content)}>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder={contact["message"]}
                value={message.content}
                onChange={(event) => handleChange(event.target.value, "content")}
                required
              />
              {!!messageError.content && errorIcon}
            </span>
            <span className="px-error capitalize">
              {!!messageError.content && messageError.content}
            </span>
          </div>
          <button
            type="submit"
            className="px-btn px-btn-primary self-end"
            aria-label="Submit message"
            disabled={isFetching || !isValid()}
          >
            {contact["send"] ?? "Send"} <span aria-hidden="true">→</span>
          </button>
          {!!resultMessage.content && (
            <div
              role="status"
              className={`flex flex-row justify-between gap-4 p-4 rounded-[12px] border-2 border-primary bg-container-paper/60 ${resultMessage.isError ? "bg-red-500/30 border-red-300" : ""}`}
            >
              <div>{resultMessage.content}</div>
              <button type="button" onClick={close} className="close cursor-pointer" aria-label="Close">
                <svg width="17" height="17" viewBox="0 0 17 17" className="fill-primary" aria-hidden="true">
                  <path d="M 3 16.5 L 17 2.5" className="stroke-2 stroke-primary" />
                  <path d="M 3 2.5 L 17 16.346" className="stroke-2 stroke-primary" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Contact;

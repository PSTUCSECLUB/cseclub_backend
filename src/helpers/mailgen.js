const Mailgen = require("mailgen");
exports.mailTemplate = (name, verifyCode) => {
  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "PSTU CSE CLUB",
      logo: "https://res.cloudinary.com/dftjtnazj/image/upload/v1681611596/nlf0fizcrhpfhsshcyao.jpg",
      link: "https://cseclub-frontend-kkedvc9fs-pstucseclub.vercel.app/",
      logoHeight: "100px",
    },
  });

  let response = {
    body: {
      name: name,
      intro:
        "Welcome to PSTU CSE CLUB! We're very excited to have you on CLUB.",
      action: {
        instructions: "Here is your Email Verification Code",
        button: {
          color: "#22BC66",
          text: verifyCode,
        },
      },
      outro: "This code will expire in 5 minutes.",
    },
  };
  let mail = MailGenerator.generate(response);

  return mail;
};

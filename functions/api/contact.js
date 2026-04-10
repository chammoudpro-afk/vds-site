export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();

    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    const payload = {
      from: "Valley Data Solutions <noreply@valleydatasolutions.com>",
      to: "chammoudpro@gmail.com", // where you receive contact form emails
      subject: "New Contact Form Submission",
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `
    };

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${context.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!resendResponse.ok) {
      console.error("Resend error:", await resendResponse.text());
      throw new Error("Email sending failed");
    }

    return new Response("Your message has been sent successfully.", {
      status: 200,
      headers: { "Content-Type": "text/plain" }
    });

  } catch (err) {
    console.error("Contact form error:", err);
    return new Response("There was an error sending your message.", {
      status: 500,
      headers: { "Content-Type": "text/plain" }
    });
  }
}
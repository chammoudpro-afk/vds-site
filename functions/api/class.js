export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();

    const name = formData.get("name");
    const email = formData.get("email");
    const details = formData.get("details");

    const payload = {
      from: "Valley Data Solutions <noreply@valleydatasolutions.com>",
      to: "chammoudpro@gmail.com", // where you receive class form emails
      subject: "New Class Sign-Up",
      html: `
        <h2>New Class Sign-Up</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Details:</strong><br>${details}</p>
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

    return new Response("Your class request has been submitted.", {
      status: 200,
      headers: { "Content-Type": "text/plain" }
    });

  } catch (err) {
    console.error("Class form error:", err);
    return new Response("There was an error submitting your request.", {
      status: 500,
      headers: { "Content-Type": "text/plain" }
    });
  }
}
import axios from "axios";

export default async function handler(req, res) {
  try {
    const { subject, contact, body, sender } = req.body;

    const token = req.headers.authorization

    await axios.post('http://localhost:8080/report-error', {
      subject,
      contact,
      body,
      sender
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  };
};
'use client';

import { getAuth, signInWithPhoneNumber } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { app } from "./config";
import { useRouter } from "next/router";

function Login() {
  const [phonenumber, setPhonenumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpSent, setOtpSent] = useState(false);

  const auth = getAuth(app);
  const router = useRouter();

  useEffect(() => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "normal",
        callback: (response) => {},
        "expired-callback": () => {},
      }
    );
  }, [auth]);

  const handelPhoneNumberChange = (e) => {
    setPhonenumber(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSendOtp = async () => {
    try {
      const formattedPhoneNumber = `${phonenumber.replace(/\D/g, "")}`;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        window.recaptchaVerifier
      );
      setConfirmationResult(confirmationResult);
      setOtpSent(true);
      setPhonenumber("");
      alert("Otp sent");
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleOtpSubmit = async() => {
    try {
        await confirmationResult.confirm(otp)
        setOtp('')
        router.push('/home')
    } catch (error) {
        console.log(error,'error')
    }
  };
  return (
    <div>
      {!otpSent ? (
        <div id="recaptcha-container"></div>
      ) : null}
      <div>
        <input
          type="tel"
          value={phonenumber}
          onChange={handelPhoneNumberChange}
          placeholder="Enter phone number"
          className="border border-gray-500 p-2 rounded-md"
        />
        <input
          type="text"
          value={otp}
          onChange={handleOtpChange}
          placeholder="Enter otp"
          className="border border-gray-500 p-2 rounded-md"
        />
      </div>
      <button onClick={otpSent ? handleOtpSubmit : handleSendOtp}
        className={`bg-${otpSent ? 'green' : 'blue'}-500 text-white p-2 rounded`}
        style={{ background: setOtp ? 'green' : 'blue' }}
      >
        {otpSent ? 'Submit OTP' : 'Send OTP'}
      </button>
    </div>
  );
}

export default Login;

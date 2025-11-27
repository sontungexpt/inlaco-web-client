import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import Color from "@constants/Color";

const VerifyEmailConfirmation = () => {
  const [isAllowGetNewVerifyLink, setIsAllowGetNewVerifyLink] = useState(true);

  useEffect(() => {
    if (!isAllowGetNewVerifyLink) {
      setTimeout(() => {
        setIsAllowGetNewVerifyLink(true);
      }, 15000);
    }
  }, [isAllowGetNewVerifyLink]);

  const textStyle = {
    color: Color.PrimaryWhite,
  };

  const handleResendVerifyLink = async () => {
    //handle resend verify link
    if (isAllowGetNewVerifyLink) {
      console.log("Resend verify link clicked");
      setIsAllowGetNewVerifyLink(false);
    }
  };

  return (
    <div className="login">
      <div style={{ alignItems: "center", textAlign: "center", padding: 50 }}>
        <h2 style={textStyle}>
          Chúng tôi đã gửi cho bạn một liên kết để xác minh email, vui lòng kiểm
          tra email và bấm vào đường link xác thực được gửi kèm để xác minh tài
          khoản của bạn!!
        </h2>
        <div style={{ marginTop: 50 }}>
          <p style={textStyle}>
            Nếu bạn đã bấm vào đường link xác thực được gửi qua email đăng ký
            của bạn, hãy bấm vào{" "}
            <Link
              to="/login"
              style={{
                textDecoration: "underline",
                color: Color.PrimaryGold,
              }}
            >
              đây
            </Link>{" "}
            để trở lại màn hình Đăng nhập
          </p>
          <p style={textStyle}>
            Nếu bạn không nhận được email xác thực hoặc đường link xác thực đã
            hết hạn, hãy bấm vào{" "}
            <span
              onClick={handleResendVerifyLink}
              style={{
                textDecoration: "underline",
                color: isAllowGetNewVerifyLink
                  ? Color.PrimaryGold
                  : Color.SecondaryGold,
                cursor: isAllowGetNewVerifyLink ? "pointer" : "default",
              }}
            >
              đây
            </span>{" "}
            để hệ thống gửi lại một đường link xác thực mới
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailConfirmation;

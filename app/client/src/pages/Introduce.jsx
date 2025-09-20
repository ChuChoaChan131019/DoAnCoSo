import React from "react";
import IntroNavbar from "../components/IntroNavbar";
import "./introduce.css";

export default function Introduce() {
  return (
    <div className="intro-root">
      <IntroNavbar />

      <main className="intro-container">
        {/* Title */}
        <div className="intro-heading">
          <p className="intro-subtitle">TRANG THÔNG TIN TÌM KIẾM VIỆC LÀM</p>
          <h1 className="intro-title">OiJobOii!</h1>
        </div>

        {/* Skeleton grid */}
        <section className="intro-grid">
          <div className="intro-card a" ><img src="1.jpg" alt="Job 1" /> </div>
          <div className="intro-card b" ><img src="2.jpg" alt="Job 2" /> </div>
          <div className="intro-card c" ><img src="3.jpg" alt="Job 3" /> </div>
          <div className="intro-card d" ><img src="4.jpg" alt="Job 4" /> </div>
          <div className="intro-card e" ><img src="5.png" alt="Job 5" /> </div>
          <div className="intro-card f" ><img src="6.jpg" alt="Job 6" /> </div>
        </section>

        {/* Description */}
        <section className="intro-text">
          <p>
            Trong bối cảnh thị trường lao động chuyển biến không ngừng, nhu cầu tìm
            kiếm việc làm và tuyển dụng ngày càng lớn. Tuy nhiên, các ứng viên thường
            gặp khó khăn khi chọn lọc các thông tin phù hợp với nhu cầu bản thân, còn
            các nhà tuyển dụng mất nhiều thời gian khi phải chọn lọc các ứng viên phù hợp.
            <br></br>
            Chính vì vậy, OiJobOii! được xây dựng với mục đích kết nối nhanh chóng giữa
            các ứng viên và nhà tuyển dụng, giảm thời gian tìm kiếm. Giúp cho các ứng
            viên có thể dễ dàng tìm được công việc phù hợp với sở thích và nhu cầu của
            bản thân thông qua công cụ tìm kiếm thông minh và tuyển dụng minh bạch. Đồng
            thời, các nhà tuyển dụng dễ dàng tiếp cận các nguồn nhân lực chất lượng, tiết
            kiệm chi phí và thời gian.
          </p>
        </section>
      </main>
    </div>
  );
}

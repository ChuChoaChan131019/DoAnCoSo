import React from "react";
import IntroNavbar from "../components/IntroNavbar"; 
import "./introduce.css";

export default function Introduce() {
  return (
    <div className="intro-root">
      <IntroNavbar />

      <section className="title">
        <h3>TRANG THÔNG TIN TÌM KIẾM VIỆC LÀM</h3>
        <h1>OiJobOii!</h1>
      </section>

      <section className="boxes">
        <div className="box b1"></div>  
        <div className="box b2"></div>  
        <div className="box b3"></div>  
        <div className="box b4"></div>  
        <div className="box b5"></div>  
        <div className="box b6"></div> 
      </section>

      <section className="description">
        <p>
          Trong bối cảnh thị trường lao động chuyển biến không ngừng, nhu cầu tìm
          kiếm việc làm và tuyển dụng ngày càng lớn. Tuy nhiên, các ứng viên thường
          gặp khó khăn khi chọn lọc các thông tin phù hợp với nhu cầu bản thân, còn
          các nhà tuyển dụng mất nhiều thời gian khi phải chọn lọc các ứng viên phù hợp.
          <br /><br />
          Chính vì vậy, OiJobOii! được xây dựng với mục đích kết nối nhanh chóng giữa các ứng viên và nhà tuyển dụng, giảm thời gian tìm kiếm.
          Giúp cho các ứng viên có thể dễ dàng tìm được công việc phù hợp với sở thích và nhu cầu của bản thân thông qua công cụ tìm kiếm thông tin
          và tuyển dụng minh bạch. Đồng thời, các nhà tuyển dụng dễ dàng tiếp cận các nguồn nhân lực chất lượng, tiết kiệm thời gian và chi phí tuyển dụng.
        </p>
      </section>
    </div>
  );
}

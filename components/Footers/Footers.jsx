"use client";

import Image from "next/image";
import footeroic from "../../public/foot.png";
import "./footers.css";

const Footers = () => {
  return (
    <footer className="image-footer">
      <Image
        src={footeroic}
        alt="Footer"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
      />
    </footer>
  );
};

export default Footers;

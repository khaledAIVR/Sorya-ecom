import React from "react";
import { Navbar } from "../components/Navbar";
import { Slider } from "../components/Slider";
import { Announcement } from "../components/Announcement";
export const Home = () => {
  return (
    <>
      <Announcement />
      <Navbar />
      <Slider />
    </>
  );
};

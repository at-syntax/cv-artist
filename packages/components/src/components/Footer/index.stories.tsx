import React from "react";
import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { Footer } from ".";

export default {
  title: "Footer",
  component: Footer,
} as ComponentMeta<typeof Footer>;

export const Template: ComponentStory<typeof Footer> = function () {
  return <Footer />;
};

Template.args = {};

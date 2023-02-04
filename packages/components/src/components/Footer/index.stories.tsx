import React from "react";
import { Footer } from ".";
import type { ComponentStory, ComponentMeta } from "@storybook/react";

export default {
  title: "Footer",
  component: Footer,
} as ComponentMeta<typeof Footer>;

export const Template: ComponentStory<typeof Footer> = function () {
  return <Footer />;
};

Template.args = {};

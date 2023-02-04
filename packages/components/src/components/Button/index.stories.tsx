import React from "react";
import { Button } from ".";
import type { ComponentStory, ComponentMeta } from "@storybook/react";

export default {
  title: "Button",
  component: Button,
} as ComponentMeta<typeof Button>;

export const Template: ComponentStory<typeof Button> = function () {
  return <Button />;
};

Template.args = {};

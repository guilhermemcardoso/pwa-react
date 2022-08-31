import * as React from "react";
import { SectionProps } from "../..";
import SignOutItem from "../SectionItems/SignOutItem";

const SecondaryItems = ({ toggleDrawer }: SectionProps) => {
  return (
    <React.Fragment>
      <SignOutItem toggleDrawer={toggleDrawer} />
    </React.Fragment>
  );
};

export default SecondaryItems;

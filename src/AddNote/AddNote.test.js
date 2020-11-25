import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import AddNote from "./AddNote";

describe("AddNote component", () => {
  const props = {
    match: { params: { folder_id: 1 } },
  };
  it.skip("renders AddNote component by default", () => {
    const wrapper = shallow(<AddNote {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

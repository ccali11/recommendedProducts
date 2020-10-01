import React from 'react';
import renderer from 'react-test-renderer';
import App from './App.jsx';
import ListItem from './ListItem.jsx';
import Dot from './Dot.jsx';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow, configure, mount } from 'enzyme';
let app;

Enzyme.configure({adapter: new Adapter()});

beforeEach(() => {
  app = shallow(<App/>);
});

test('test suite is functional', () => {
  expect(true).toBe(true);
});

test('should render at least one ListItem component', () => {
  // this gets to listItems, but it's showing me an empty array:
  const items = app.find('div').getElements()[1].props.children.props.listItems;
  expect(items.length).not.toBe(0);
});

test('should have image, price, product name, department, and brand properties', () => {
  const firstItem = app.prop('children')[2].props.children.props.listItems[0];
  expect(!!(firstItem.imageUrl && firstItem.price && firstItem.department && firstItem.brand)).toBe(true);
});

test('should have 4 dots by default', () => {
  expect(app.find('div').getElements()[0].props.children.length).toBe(4);
});

test('should have the first dot selected by default, and no other dots selected', () => {
  const dots = app.prop('children')[3].props.children;
  expect(!!dots[0].props.selected).toBe(true);
  for (let i = 1; i < dots.length; i++) {
    expect(!!dots[i].props.selected).toBe(false);
  }
});

test('should have elements for an image, price, and product name', () => {
  const listItem = shallow(<ListItem item={{}}/>);
  const expectedElements = ['img', 'p', 'p'];
  const children = listItem.prop('children').props.children;
  children.forEach((child, i) => {
    expect(child.type.target).toBe(expectedElements[i]);
  });
});

test('should change state of selected dot on dot click', (done) => {
  let dots = app.prop('children')[3].props.children;
  const dotWrappers = [shallow(dots[0]), shallow(dots[1]), shallow(dots[2]), shallow(dots[3])];

  // random element chosen because looping over them was causing issues with asynchronous execution
    // and I didn't want to copy-paste 3 times
  let i = Math.floor(Math.random() * dots.length);
  dotWrappers[i].simulate('click');
  // need to use setTimeout--moves functionality to event loop so React can update state first
  setTimeout(() => {
    dots = app.prop('children')[3].props.children;
    expect(!!dots[i].props.selected).toBe(true);
    for (let j = 0; j < dots.length; j++) {
      if (i !== j) {
        expect(!!dots[j].props.selected).toBe(false);
      }
    }
    done();
  }, 0);
});



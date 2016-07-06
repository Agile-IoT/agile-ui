import { renderComponent, expect } from '../testHelper';
import DeviceList from '../../../src/js/containers/DeviceList/DeviceList';

describe('DeviceList', () => {

  let component;

  beforeEach(() => {
    component = renderComponent(DeviceList);
  });

  it('shows an input to add a new friend', () => {
    expect(component.find('.addFriendInput')).to.exist;
  });

  it('shows a friend list', () => {
    expect(component.find('.friendList')).to.exist;
  });
});

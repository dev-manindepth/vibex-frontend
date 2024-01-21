import { updatePostItem } from '@redux-toolkit/reducers/post/post.reducer';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import '@components/select-dropdown/SelectDropdown.scss';

interface ISelectDropdown {
  isActive: boolean;
  setSelectedItem: (item: any) => void;
  items: any[];
}
const SelectDropdown: React.FC<ISelectDropdown> = ({ isActive, setSelectedItem, items = [] }) => {
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const selectItem = (item: any) => {
    setSelectedItem(item);
    dispatch(updatePostItem({ privacy: item.topText }));
  };

  return (
    <div className="menu-container" data-testid="menu-container">
      <nav ref={dropdownRef} className={`menu ${isActive ? 'active' : 'inactive'}`}>
        <ul>
          {items.map((item, index) => (
            <li data-testid="select-dropdown" key={index} onClick={() => selectItem(item)}>
              <div className="menu-icon">{item.icon}</div>
              <div className="menu-text">
                <div className="menu-text-header">{item.topText}</div>
                <div className="sub-header">{item.subText}</div>
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SelectDropdown;

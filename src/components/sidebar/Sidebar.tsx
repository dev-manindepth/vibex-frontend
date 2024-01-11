import { fontAwesomeIcons, sideBarItems } from '@services/utils/static.data';
import React, { useEffect, useState } from 'react';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import '@components/sidebar/Sidebar.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@redux-toolkit/store';

interface ISideBarItems {
  index: number;
  name: string;
  url: string;
  iconName: string;
}
const Sidebar: React.FC = () => {
  const { profile } = useSelector((state: RootState) => state.user);
  const [sidebar, setSidebar] = useState<ISideBarItems[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const checkUrlPath = (name: string) => {
    return location.pathname.includes(name.toLowerCase());
  };
  const navigateToPage = (name: string, url: string) => {
    if (name === 'Profile') {
      const params = new URLSearchParams();
      params.append('id', profile?._id || ''); // Append 'id' parameter
      params.append('uId', profile?.uId || ''); // Append 'uId' parameter

      // Append the username to the URL
      url = `${url}/${profile?.username}?${params.toString()}`;
    }

    navigate(url);
  };

  useEffect(() => {
    setSidebar(sideBarItems);
  }, []);
  return (
    <div className="app-side-menu">
      <div className="side-menu">
        <ul className="list-unstyled">
          {sidebar &&
            sidebar.map((data) => {
              return (
                <li key={data.index} onClick={() => navigateToPage(data.name, data.url)}>
                  <div className={`sidebar-link ${checkUrlPath(data.name) ? 'active' : ''}`}>
                    <div className="menu-icon">{fontAwesomeIcons[data.iconName]}</div>
                    <div className="menu-link">
                      <span>{`${data.name}`}</span>
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

/// Menu
import React, { useContext, useEffect, useReducer, useState } from 'react';

/// Scroll
import PerfectScrollbar from 'react-perfect-scrollbar';
import Collapse from 'react-bootstrap/Collapse';

/// Link
import { Link, NavLink } from 'react-router-dom';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import { ThemeContext } from '../../../context/ThemeContext';
import { useSelector } from 'react-redux';
import { CustomerMenuList } from './CustomerMenu';

const reducer = (previousState, updatedState) => ({
  ...previousState,
  ...updatedState,
});

const initialState = {
  active: '',
  activeSubmenu: '',
};

const CustomerSideBar = () => {
  const { iconHover, sidebarposition, headerposition, sidebarLayout } = useContext(ThemeContext);

  const [state, setState] = useReducer(reducer, initialState);

  let handleheartBlast = document.querySelector('.heart');
  function heartBlast() {
    return handleheartBlast.classList.toggle('heart-blast');
  }

  const { restaurantPath } = useSelector((state) => state.customer);
  useEffect(() => {}, []);
  //For scroll
  const [hideOnScroll, setHideOnScroll] = useState(true);
  useScrollPosition(
    ({ prevPos, currPos }) => {
      const isShow = currPos.y > prevPos.y;
      if (isShow !== hideOnScroll) setHideOnScroll(isShow);
    },
    [hideOnScroll],
  );

  const handleMenuActive = (status) => {
    setState({ active: status });
    if (state.active === status) {
      //setActive('');
      setState({ active: '' });
    }
  };
  const handleSubmenuActive = (status) => {
    setState({ activeSubmenu: status });
    if (state.activeSubmenu === status) {
      setState({ activeSubmenu: '' });
    }
    //status.preventDefault();
  };
  // Menu dropdown list End

  /// Path
  let path = window.location.pathname;
  path = path.split('/');
  path = path[path.length - 1];
  /// Active menu

  return (
    <div
      className={`dlabnav  border-right ${iconHover} ${
        sidebarposition.value === 'fixed' && sidebarLayout.value === 'horizontal' && headerposition.value === 'static'
          ? hideOnScroll > 120
            ? 'fixed'
            : ''
          : ''
      }`}
    >
      <PerfectScrollbar className="dlabnav-scroll">
        <ul className="metismenu" id="menu">
          {/* <li className="menu-title"> Main Menu</li> */}
          {CustomerMenuList.map((data, index) => {
            let menuClass = data.classsChange;
            if (menuClass === 'menu-title') {
              return (
                <li key={index} className={menuClass}>
                  {data.title}
                </li>
              );
            } else {
              return (
                <li className={` ${state.active === data.title ? 'mm-active' : ''}`} key={index}>
                  {data.content && data.content.length > 0 ? (
                    <Link
                      to={'#'}
                      className="has-arrow"
                      onClick={() => {
                        handleMenuActive(data.title);
                      }}
                    >
                      <i className={data.iconStyle}></i>
                      <span className="nav-text">{data.title}</span>
                    </Link>
                  ) : (
                    <NavLink to={data.title == 'Home' ? restaurantPath : data.title == 'Cart' ? restaurantPath + '/Cart' : data.to}>
                      <i className={data.iconStyle}></i>
                      <span className="nav-text">{data.title}</span>
                    </NavLink>
                  )}
                  <Collapse in={state.active === data.title ? true : false}>
                    <ul className={`${menuClass === 'mm-collapse' ? 'mm-show' : ''}`}>
                      {data.content &&
                        data.content.map((data, index) => {
                          return (
                            <li key={index} className={`${state.activeSubmenu === data.title ? 'mm-active' : ''}`}>
                              {data.content && data.content.length > 0 ? (
                                <NavLink
                                  to={data.to}
                                  className={data.hasMenu ? 'has-arrow' : ''}
                                  onClick={() => {
                                    handleSubmenuActive(data.title);
                                  }}
                                >
                                  {data.title}
                                </NavLink>
                              ) : (
                                <Link to={data.to}>{data.title}</Link>
                              )}
                              <Collapse in={state.activeSubmenu === data.title ? true : false}>
                                <ul className={`${menuClass === 'mm-collapse' ? 'mm-show' : ''}`}>
                                  {data.content &&
                                    data.content.map((data, index) => {
                                      return (
                                        <>
                                          <li key={index}>
                                            <Link className={`${path === data.to ? 'mm-active' : ''}`} to={data.to}>
                                              {data.title}
                                            </Link>
                                          </li>
                                        </>
                                      );
                                    })}
                                </ul>
                              </Collapse>
                            </li>
                          );
                        })}
                    </ul>
                  </Collapse>
                </li>
              );
            }
          })}
        </ul>
        {/* <div className="plus-box">
          <div className="d-flex align-items-center">
            <h5>Upgrade your Account to Get Free Voucher</h5>
          </div>
          <Link to={"#"} className="btn bg-white btn-sm">
            Upgrade
          </Link>
        </div> */}
        {/* <div className="copyright mt-0">
          <p>
            <strong>Food Desk - Online Food Delivery Admin Dashboard</strong> ©
            2022 All Rights Reserved
          </p>
          <p className="fs-12">
            Made with
            <span className="heart" onClick={() => heartBlast()}></span> by
            DexignLab
          </p>
        </div> */}
        <div className="d-block">
          <div style={{ height: '400px' }}></div>
          <div className="copyright mt-0">
            <Link className="text-primary" to={'/shops'}>
              See all restaurants
            </Link>
          </div>
        </div>
      </PerfectScrollbar>
    </div>
  );
};

export default CustomerSideBar;

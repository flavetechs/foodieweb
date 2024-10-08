import { lazy, Suspense, useEffect } from 'react';

/// Components
import Index, { CustomerLayout } from './jsx';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
// action
import { checkAutoLogin, session_Token } from './services/AuthService';
/// Style
import './vendor/bootstrap-select/dist/css/bootstrap-select.min.css';
import './css/style.css';
import { socket } from './services/socket/SocketService';
import { eventActions } from './services/socket/map-event-actions';
import React from 'react';
// import CustomerHome from './jsx/components/Customers/Home';
import { customerRoutes } from './jsx/pages/routes/customerRoutes';
import { generateTemporalId } from './store/actions';
import FoodDeliverySpinner from './jsx/utils/spinner';

const SignUp = lazy(() => import('./jsx/pages/Registration'));
const ForgotPassword = lazy(() => import('./jsx/pages/ForgotPassword'));
const Login = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import('./jsx/pages/Login')), 500);
  });
});

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();

    return <Component {...props} router={{ location, navigate, params }} />;
  }

  return ComponentWithRouterProp;
}

function App(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = session_Token();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]);

  useEffect(() => {
    generateTemporalId()(dispatch);
  }, []);

  useEffect(() => {
    checkAutoLogin(dispatch, navigate);
  }, []);

  function connectToGateway(evAc) {
    if (evAc.dispatchAble) return evAc.action()(dispatch);
    else return evAc.action();
  }

  useEffect(() => {
    if (socket) {
      props.socket.rooms.length > 0 &&
        props.socket.rooms.forEach((evAc) => {
          const roomid = evAc.roomId;
          socket.emit('join_room', { roomName: roomid }, (response) => {
            socket.on(roomid, () => evAc.action(roomid));
          });
        });

      return () => {
        props.socket.rooms.length > 0 &&
          props.socket.rooms.forEach((evAc) => {
            const roomid = evAc.roomId;
            socket.emit('leave_room', { roomName: roomid }, (response) => {
              console.log('response', response);
            });
          });
      };
    }
  }, [socket, props.socket.rooms]);

  useEffect(() => {
    if (socket) {
      eventActions &&
        eventActions.forEach((evAc) => {
          socket.on(evAc.event, () => connectToGateway(evAc));
        });

      return () => {
        eventActions &&
          eventActions.forEach((evAc) => {
            socket.off(evAc.event);
          });
      };
    }
  }, [socket]);

  let routeblog = (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/page-register" element={<SignUp />} />
      <Route path="/page-forgot-password" element={<ForgotPassword history={undefined} />} />
      <Route element={<CustomerLayout />}>
        {customerRoutes.map((data, i) => (
          <Route key={i} path={`${data.url}`} element={data.component} />
        ))}
      </Route>
    </Routes>
  );

  if (props.isAuthenticated) {
    return (
      <>
        <Suspense
          fallback={
            <div id="preloader">
              <div className="sk-three-bounce">
                <div className="sk-child sk-bounce1"></div>
                <div className="sk-child sk-bounce2"></div>
                <div className="sk-child sk-bounce3"></div>
              </div>
            </div>
          }
        >
          <>
            <FoodDeliverySpinner />
            <Index />
          </>
        </Suspense>
      </>
    );
  } else {
    return (
      <div className="vh-100">
        <Suspense
          fallback={
            <div id="preloader">
              <div className="sk-three-bounce">
                <div className="sk-child sk-bounce1"></div>
                <div className="sk-child sk-bounce2"></div>
                <div className="sk-child sk-bounce3"></div>
              </div>
            </div>
          }
        >
          <>
            <FoodDeliverySpinner />
            {routeblog}
          </>
        </Suspense>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: session_Token() ? true : false,
    socket: state.socket,
  };
};

//export default connect((mapStateToProps)(App));
export default withRouter(connect(mapStateToProps)(App));

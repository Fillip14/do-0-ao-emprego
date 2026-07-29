import logo from '../assets/check-task-manager.svg';

const Header = () => {
  return (
    <header className="header-site" style={{ color: 'GrayText', fontSize: 20 }}>
      <h1>Task Manager</h1>
      <img src={logo} alt="Logo do Task manager" />
    </header>
  );
};

export default Header;

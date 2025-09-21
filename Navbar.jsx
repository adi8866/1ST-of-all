// src/components/Navbar.jsx
import React from "react";
import { assets } from "../assets/assets";

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    let initialUser = null;
    try {
      initialUser = JSON.parse(localStorage.getItem("qb_user")) || null;
    } catch {
      initialUser = null;
    }
    this.state = { user: initialUser };
  }

  componentDidMount() {
    window.addEventListener("storage", this.handleStorage);
  }

  componentWillUnmount() {
    window.removeEventListener("storage", this.handleStorage);
  }

  handleStorage = (e) => {
    if (e.key === "qb_user") {
      let next = null;
      try {
        next = e.newValue ? JSON.parse(e.newValue) : null;
      } catch {
        next = null;
      }
      this.setState({ user: next });
    }
  };

  // 🔹 Fake login: set a dummy user
  handleLogin = () => {
    const fakeUser = {
      name: "Demo User",
      email: "demo@example.com",
      picture:
        "https://api.dicebear.com/8.x/avataaars/svg?seed=quickblog", // random avatar
      provider: "fake",
    };

    localStorage.setItem("qb_user", JSON.stringify(fakeUser));
    this.setState({ user: fakeUser });
  };

  handleLogout = () => {
    localStorage.removeItem("qb_user");
    this.setState({ user: null });
  };

  render() {
    const { user } = this.state;

    return (
      <header className="bg-[#0E3A2D] text-[#E7C48C] border-b border-emerald-900/40 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:pr-12">
          <div className="flex items-center justify-between min-h-[72px]">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <img
                src={assets.logo}
                alt="Quickblog logo"
                className="h-12 w-auto sm:h-14 object-contain"
              />
            </a>

            {/* Right cluster */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-3 pr-2">
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="h-9 w-9 rounded-full border border-[#E7C48C]/40 object-cover"
                    />
                    <div className="hidden sm:block text-sm leading-tight">
                      <div className="font-semibold">{user.name}</div>
                      <div className="opacity-80">{user.email}</div>
                    </div>
                  </div>

                  <button
                    onClick={this.handleLogout}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-[#0E3A2D] bg-[#F5B8A1] border border-[#F2A98C] shadow-sm hover:bg-[#F2A98C] active:translate-y-px transition"
                  >
                    Logout
                    <img src={assets.arrow} alt="" className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={this.handleLogin}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-[#0E3A2D] bg-gradient-to-r from-[#F5B8A1] to-[#E7C48C] border border-[#F2A98C] shadow-md hover:from-[#F2A98C] hover:to-[#F5B8A1] active:scale-95 transition"
                >
                  Login
                  <img src={assets.arrow} alt="" className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Navbar;

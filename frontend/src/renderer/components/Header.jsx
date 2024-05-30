import React, { useState } from 'react';

export default function Header({sidebarOut,handleSideBar}) {

	const toggleSidebar = () => {
		if (sidebarOut) {
			document.body.classList = 'ec-header-fixed ec-sidebar-fixed ec-sidebar-light ec-header-light sidebar-minified-out';
		} else {
			document.body.classList = 'ec-header-fixed ec-sidebar-fixed ec-sidebar-light ec-header-light sidebar-minified';

		}
		handleSideBar();

	};


	return (
		<React.Fragment>
			<header className="ec-main-header" id="header">
				<nav className="navbar navbar-static-top navbar-expand-lg" style={{ display: "flex", justifyContent: "end", alignItems: "center" }}>
					{!sidebarOut && (
						<button id="sidebar-toggler" className="sidebar-toggle button-toggle" onClick={toggleSidebar}></button>
					)}
					<div className="navbar-right">
						<ul className="nav navbar-nav">
							<li className="dropdown notifications-menu custom-dropdown">
								<button className="dropdown-toggle notify-toggler custom-dropdown-toggler" style={{ color: 'black' }}>
									<i className="mdi mdi-bell-outline"></i>
								</button>
								<div className="card card-default dropdown-notify dropdown-menu-right mb-0">
									<div className="card-header card-header-border-bottom px-3">
										<h2>Notifications</h2>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</nav>
			</header>
		</React.Fragment>
	);
}
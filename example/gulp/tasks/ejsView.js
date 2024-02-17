const ejsView = () => {
	return appGulp(appGulp.plugins.browsersync.stream())
}

module.exports = ejsView
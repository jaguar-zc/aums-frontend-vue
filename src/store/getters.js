const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  user: state => state.user.userInfo,
  visitedViews: state => state.tagsView.visitedViews,
}
export default getters

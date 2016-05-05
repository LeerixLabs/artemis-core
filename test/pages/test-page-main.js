window.testPageInit = function testPageInit() {
  document.artemisInit("");
};

window.testPageLocate = function testPageLocate() {
  var elmDesc = document.getElementById('elm-description-input').value;
  document.artemisLocate(elmDesc);
};

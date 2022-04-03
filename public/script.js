const switchButton = document.querySelector('.switch');
const switchBackground = switchButton.querySelector('.switch__background');
const egg = switchButton.querySelector('.egg');
const eggMainGroup = egg.querySelector('.egg__mainGroup');
const eggWhite = egg.querySelector('.egg__white.-fried');
const eggWhiteMiddle = egg.querySelector('.egg__white.-middle');
const eggWhiteRaw = egg.querySelector('.egg__white.-raw');
const yolk = egg.querySelector('.egg__yolk');
const yolkShadows = Array.from(egg.querySelectorAll('.egg__yolkShadow'));

const EGG_RAW_PATH = eggWhiteRaw.getAttribute('d');
const EGG_MIDDLE_PATH = eggWhiteMiddle.getAttribute('d');
const EGG_FRIED_PATH = eggWhite.getAttribute('d');

const SWITCH_PADDING = Number(
  getComputedStyle(eggMainGroup).transform.split(',')[4]
);

const {
  switchBackgroundCoords,
  eggCoords,
  eggWhiteCoords,
  eggWhiteRawCoords,
  eggWhiteMiddleCoords,
  yolkCoords,
} = (() => {
  const elements = { switchBackground, egg, eggWhite, eggWhiteRaw, eggWhiteMiddle, yolk };
  return Object.keys(elements).reduce((previous, elementName) => {
    return { ...previous, [`${elementName}Coords`]: elements[elementName].getBoundingClientRect() };
  }, {});
})();

let isAnimating = false;

const toggleAnimationController = () => { isAnimating = !isAnimating; };

const toggleEggWhite = isOff => {
  const scaleMiddle = 0.7;
  const xMiddle = eggCoords.width / 2 - (eggWhiteCoords.width * scaleMiddle) / 2;
  new TimelineLite()
    .to(eggWhite, 0.25, {
      x: xMiddle,
      y: eggWhiteMiddleCoords.height / 4,
      scale: scaleMiddle,
      ease: Circ.easeIn,
      attr: {
        d: EGG_MIDDLE_PATH
      }
    })
    .to(eggWhite, 0.25, {
      x: isOff ? '0%' : eggCoords.width - eggWhiteRawCoords.width - SWITCH_PADDING * 2,
      y: '0%',
      scale: 1,
      ease: Back.easeOut.config(1.7),
      attr: {
        d: isOff ? EGG_FRIED_PATH : EGG_RAW_PATH
      }
    });
};

const toggleYolk = isOff => {
  const xMiddle = eggCoords.width / 2 - yolkCoords.width;
  const xRaw =
  eggCoords.width - eggWhiteRawCoords.width - yolkCoords.width - SWITCH_PADDING / 2;
  new TimelineLite()
    .to(yolk, 0.25, {
      x: xMiddle,
      y: 10,
      ease: Circ.easeIn,
      opacity: 0
    })
    .to(yolk, 0.25, {
      x: isOff ? '0%' : xRaw,
      fill: isOff ? '#facf37' : '#FDDD71',
      y: isOff ? '0%' : 15,
      opacity: 1,
      ease: Back.easeOut.config(1.7)
    });
};

const toggleYolkShadows = isOff => {
  const toggleShadow = item => {
    new TweenLite(item, 0.1, {
      ...isOff ? { delay: 0.35 } : {},
      opacity: isOff ? 1 : 0,
    })
  }
  yolkShadows.forEach(toggleShadow);
};

const toggleSwitchMovement = isOff => {
  new TweenLite(switchButton, 0.4, {
      x: isOff ? '0%' : '3vw',
      ease: Power1.easeInOut
    });
};

const toggleSwitchBackground = isOff => {
  const x = isOff ? '0%' : eggCoords.width - switchBackgroundCoords.width;
  new TweenMax(switchBackground, 0.5, {
    x,
    ease: Back.easeOut.config(1.7),
    onComplete: toggleAnimationController,
  });
};

const toggle = () => {
  if (isAnimating) return;

  toggleAnimationController();
  const isOff = switchButton.classList.contains('-off');
  switchButton.classList.toggle('-off');
  toggleSwitchBackground(isOff);
  toggleEggWhite(isOff);
  toggleYolk(isOff);
  toggleYolkShadows(isOff);
  toggleSwitchMovement(isOff);
};

switchButton.addEventListener('click', toggle);

window.addEventListener("DOMContentLoaded", function () {
  ("use strict");
  // popup
  var typeAnimate = "fade";
  (function () {
    // коллекция всех элементов на странице, которые могут открывать всплывающие окна
    // их отличительной особенность является наличие атрибута '[data-modal]'
    const mOpen = document.querySelectorAll("[data-modal]");
    // если нет элементов управления всплывающими окнами, прекращаем работу скрипта
    if (mOpen.length == 0) return;

    // подложка под всплывающее окно
    const overlay = document.querySelector(".overlay"),
      // коллекция всплывающих окон
      modals = document.querySelectorAll(".modal-1"),
      // коллекция всех элементов на странице, которые могут
      // закрывать всплывающие окна
      // их отличительной особенность является наличие атрибута '[data-close]'
      mClose = document.querySelectorAll("[data-close]");
    // флаг всплывающего окна: false - окно закрыто, true - открыто
    let mStatus = false;

    for (let el of mOpen) {
      el.addEventListener("click", function (e) {
        // используюя атрибут [data-modal], определяем ID всплывающего окна,
        // которое требуется открыть
        // по значению ID получаем ссылку на элемент с таким идентификатором
        let modalId = el.dataset.modal,
          modal = document.getElementById(modalId);
        // вызываем функцию открытия всплывающего окна, аргументом
        // является объект всплывающего окна
        modalShow(modal);
      });
    }

    // регистрируются обработчики событий на элементах, закрывающих
    // всплывающие окна
    for (let el of mClose) {
      el.addEventListener("click", modalClose);
    }

    // регистрируются обработчик события нажатия на клавишу
    document.addEventListener("keydown", modalClose);

    function modalShow(modal) {
      // показываем подложку всплывающего окна
      overlay.classList.remove("fadeOut");
      overlay.classList.add("fadeIn");

      // определяем тип анимации появления всплывающего окна
      // убираем и добавляем классы, соответствующие типу анимации
      if (typeAnimate === "fade") {
        modal.classList.remove("fadeOut");
        modal.classList.add("fadeIn");
      } else if (typeAnimate === "slide") {
        modal.classList.remove("slideOutUp");
        modal.classList.add("slideInDown");
      }
      // выставляем флаг, обозначающий, что всплывающее окно открыто
      mStatus = true;
    }

    function modalClose(event) {
      if (mStatus && (event.type != "keydown" || event.keyCode === 27)) {
        // обходим по очереди каждый элемент коллекции modals (каждое всплывающее окно)
        // и в зависимости от типа анимации, используемой на данной странице,
        // удаляем класс анимации открытия окна и добавляем класс анимации закрытия
        for (let modal of modals) {
          if (typeAnimate == "fade") {
            modal.classList.remove("fadeIn");
            modal.classList.add("fadeOut");
          } else if (typeAnimate == "slide") {
            modal.classList.remove("slideInDown");
            modal.classList.add("slideOutUp");
          }
        }

        // закрываем overlay
        overlay.classList.remove("fadeIn");
        overlay.classList.add("fadeOut");
        // сбрасываем флаг, устанавливая его значение в 'false'
        // это значение указывает нам, что на странице нет открытых
        // всплывающих окон
        mStatus = false;
      }
    }
  })();

  // tabs

  let tab = document.querySelectorAll(".works__item");
  let info = document.querySelector(".works__menu");
  let content = document.querySelectorAll(".works__gallery");

  function hideTabContent(a) {
    for (let i = a; i < content.length; i++) {
      content[i].classList.remove("show");
      content[i].classList.add("hide");
      tab[i].classList.remove("works__item-active");
    }
  }
  hideTabContent(1);
  function showTabContent(b) {
    if (content[b].classList.contains("hide")) {
      content[b].classList.remove("hide");
      content[b].classList.add("show");
      tab[b].classList.add("works__item-active");
    }
  }
  info.addEventListener("click", function (event) {
    let target = event.target;
    if (target && target.classList.contains("works__item")) {
      for (let i = 0; i < tab.length; i++) {
        if (target == tab[i]) {
          hideTabContent(0);
          showTabContent(i);
          break;
        }
      }
    }
  });

  // initial slider

  new ChiefSlider(".slider");
  // // new ChiefSlider(".slider-2");

  // const $sliders = document.querySelectorAll('[data-slider="chiefslider"]');
  // $sliders.forEach(function ($item) {
  //   if (
  //     $item.querySelector(".slider__item").getBoundingClientRect().width *
  //       $item.querySelectorAll(".slider__item").length >
  //     $item.querySelector(".slider__wrapper").getBoundingClientRect().width
  //   ) {
  //     // добавим индикаторы
  //     const $indicators = document.createElement("ol");
  //     $indicators.className = "slider__indicators";
  //     let inner = "";
  //     $item
  //       .querySelectorAll(".slider__item")
  //       .forEach(function ($sliderItem, index) {
  //         inner += `<li data-slide-to="${index}"></li>`;
  //       });
  //     $indicators.innerHTML = inner;
  //     $item.appendChild($indicators);
  //     // инициализируем слайдер
  //     new ChiefSlider(".slider-2");
  //   } else {
  //     $item.querySelectorAll(".slider__control").forEach(function ($control) {
  //       $control.style.display = "none";
  //     });
  //   }
  // });
  // new ChiefSlider(".slider-2");

  var slideShow = (function () {
    return function (selector, config) {
      var _slider = document.querySelector(selector), // основный элемент блока
        _sliderContainer = _slider.querySelector(".slider__items"), // контейнер для .slider-item
        _sliderItems = _slider.querySelectorAll(".slider__item"), // коллекция .slider-item
        _sliderControls = _slider.querySelectorAll(".slider__control"), // элементы управления
        _currentPosition = 0, // позиция левого активного элемента
        _transformValue = 0, // значение транфсофрмации .slider_wrapper
        _transformStep = 100, // величина шага (для трансформации)
        _itemsArray = [], // массив элементов
        _timerId,
        _indicatorItems,
        _indicatorIndex = 0,
        _indicatorIndexMax = _sliderItems.length - 1,
        _config = {
          isAutoplay: false, // автоматическая смена слайдов
          directionAutoplay: "next", // направление смены слайдов
          delayAutoplay: 5000, // интервал между автоматической сменой слайдов
          isPauseOnHover: true, // устанавливать ли паузу при поднесении курсора к слайдеру
        };

      // настройка конфигурации слайдера в зависимости от полученных ключей
      for (var key in config) {
        if (key in _config) {
          _config[key] = config[key];
        }
      }

      // наполнение массива _itemsArray
      for (var i = 0; i < _sliderItems.length; i++) {
        _itemsArray.push({ item: _sliderItems[i], position: i, transform: 0 });
      }

      // переменная position содержит методы с помощью которой можно получить минимальный и максимальный индекс элемента, а также соответствующему этому индексу позицию
      var position = {
        getItemIndex: function (mode) {
          var index = 0;
          for (var i = 0; i < _itemsArray.length; i++) {
            if (
              (_itemsArray[i].position < _itemsArray[index].position &&
                mode === "min") ||
              (_itemsArray[i].position > _itemsArray[index].position &&
                mode === "max")
            ) {
              index = i;
            }
          }
          return index;
        },
        getItemPosition: function (mode) {
          return _itemsArray[position.getItemIndex(mode)].position;
        },
      };

      // функция, выполняющая смену слайда в указанном направлении
      var _move = function (direction) {
        var nextItem,
          currentIndicator = _indicatorIndex;
        if (direction === "next") {
          _currentPosition++;
          if (_currentPosition > position.getItemPosition("max")) {
            nextItem = position.getItemIndex("min");
            _itemsArray[nextItem].position =
              position.getItemPosition("max") + 1;
            _itemsArray[nextItem].transform += _itemsArray.length * 100;
            _itemsArray[nextItem].item.style.transform =
              "translateX(" + _itemsArray[nextItem].transform + "%)";
          }
          _transformValue -= _transformStep;
          _indicatorIndex = _indicatorIndex + 1;
          if (_indicatorIndex > _indicatorIndexMax) {
            _indicatorIndex = 0;
          }
        } else {
          _currentPosition--;
          if (_currentPosition < position.getItemPosition("min")) {
            nextItem = position.getItemIndex("max");
            _itemsArray[nextItem].position =
              position.getItemPosition("min") - 1;
            _itemsArray[nextItem].transform -= _itemsArray.length * 100;
            _itemsArray[nextItem].item.style.transform =
              "translateX(" + _itemsArray[nextItem].transform + "%)";
          }
          _transformValue += _transformStep;
          _indicatorIndex = _indicatorIndex - 1;
          if (_indicatorIndex < 0) {
            _indicatorIndex = _indicatorIndexMax;
          }
        }
        _sliderContainer.style.transform =
          "translateX(" + _transformValue + "%)";
        _indicatorItems[currentIndicator].classList.remove("active");
        _indicatorItems[_indicatorIndex].classList.add("active");
      };

      // функция, осуществляющая переход к слайду по его порядковому номеру
      var _moveTo = function (index) {
        var i = 0,
          direction = index > _indicatorIndex ? "next" : "prev";
        while (index !== _indicatorIndex && i <= _indicatorIndexMax) {
          _move(direction);
          i++;
        }
      };

      // функция для запуска автоматической смены слайдов через промежутки времени
      var _startAutoplay = function () {
        if (!_config.isAutoplay) {
          return;
        }
        _stopAutoplay();
        _timerId = setInterval(function () {
          _move(_config.directionAutoplay);
        }, _config.delayAutoplay);
      };

      // функция, отключающая автоматическую смену слайдов
      var _stopAutoplay = function () {
        clearInterval(_timerId);
      };

      // функция, добавляющая индикаторы к слайдеру
      var _addIndicators = function () {
        var indicatorsContainer = document.createElement("ol");
        indicatorsContainer.classList.add("slider__indicators");
        for (var i = 0; i < _sliderItems.length; i++) {
          var sliderIndicatorsItem = document.createElement("li");
          if (i === 0) {
            sliderIndicatorsItem.classList.add("active");
          }
          sliderIndicatorsItem.setAttribute("data-slide-to", i);
          indicatorsContainer.appendChild(sliderIndicatorsItem);
        }
        _slider.appendChild(indicatorsContainer);
        _indicatorItems = _slider.querySelectorAll(".slider__indicators > li");
      };

      // функция, осуществляющая установку обработчиков для событий
      var _setUpListeners = function () {
        document.addEventListener(
          "visibilitychange",
          function () {
            if (document.visibilityState === "hidden") {
              _stopAutoplay();
            } else {
              _startAutoplay();
            }
          },
          false
        );
        if (_config.isPauseOnHover && _config.isAutoplay) {
          _slider.addEventListener("mouseenter", function () {
            _stopAutoplay();
          });
          _slider.addEventListener("mouseleave", function () {
            _startAutoplay();
          });
        }
      };

      // добавляем индикаторы к слайдеру
      _addIndicators();
      // установливаем обработчики для событий
      _setUpListeners();
      // запускаем автоматическую смену слайдов, если установлен соответствующий ключ
      _startAutoplay();

      return {
        // метод слайдера для перехода к следующему слайду
        next: function () {
          _move("next");
        },
        // метод слайдера для перехода к предыдущему слайду
        left: function () {
          _move("prev");
        },
        moveTo: function (index) {
          _moveTo(index);
        },
        // метод отключающий автоматическую смену слайдов
        stop: function () {
          _config.isAutoplay = false;
          _stopAutoplay();
        },
        // метод запускающий автоматическую смену слайдов
        cycle: function () {
          _config.isAutoplay = true;
          _startAutoplay();
        },
      };
    };
  })();

  var sliderElements = document.querySelectorAll(".slider-2");
  var sliders = [];
  for (var i = 0, length = sliderElements.length; i < length; i++) {
    sliderElements[i].id = "slider-id-" + i;
    sliders.push(sliderElements[i]);
    sliders[i] = slideShow("#slider-id-" + i, {
      isAutoplay: true,
    });
  }
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("slider__control_next")) {
      e.preventDefault();
      for (var i = 0, length = sliders.length; i < length; i++) {
        sliders[i].next();
      }
    } else if (e.target.classList.contains("slider__control_prev")) {
      e.preventDefault();
      for (var i = 0, length = sliders.length; i < length; i++) {
        sliders[i].left();
      }
    } else if (e.target.getAttribute("data-slide-to")) {
      e.preventDefault();
      if (e.target.closest(".slider-2").id === "slider-id-0") {
        for (var i = 0, length = sliders.length; i < length; i++) {
          sliders[i].moveTo(parseInt(e.target.getAttribute("data-slide-to")));
        }
      }
    }
  });
});

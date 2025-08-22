! function (e, t) {
  "object" == typeof exports && "undefined" != typeof module ? t(exports) : "function" == typeof define && define.amd ? define(["exports"], t) : t((e = "undefined" != typeof globalThis ? globalThis : e || self).Popper = {})
}(this, (function (e) {
  "use strict";

  function t(e) {
    if (null == e) return window;
    if ("[object Window]" !== e.toString()) {
      var t = e.ownerDocument;
      return t && t.defaultView || window
    }
    return e
  }

  function n(e) {
    return e instanceof t(e).Element || e instanceof Element
  }

  function i(e) {
    return e instanceof t(e).HTMLElement || e instanceof HTMLElement
  }

  function a(e) {
    return "undefined" != typeof ShadowRoot && (e instanceof t(e).ShadowRoot || e instanceof ShadowRoot)
  }
  var r = Math.round;

  function s(e, t) {
    void 0 === t && (t = !1);
    var n = e.getBoundingClientRect(),
      a = 1,
      s = 1;
    if (i(e) && t) {
      var o = e.offsetHeight,
        l = e.offsetWidth;
      l > 0 && (a = n.width / l || 1), o > 0 && (s = n.height / o || 1)
    }
    return {
      width: r(n.width / a),
      height: r(n.height / s),
      top: r(n.top / s),
      right: r(n.right / a),
      bottom: r(n.bottom / s),
      left: r(n.left / a),
      x: r(n.left / a),
      y: r(n.top / s)
    }
  }

  function o(e) {
    var n = t(e);
    return {
      scrollLeft: n.pageXOffset,
      scrollTop: n.pageYOffset
    }
  }

  function l(e) {
    return e ? (e.nodeName || "").toLowerCase() : null
  }

  function c(e) {
    return ((n(e) ? e.ownerDocument : e.document) || window.document).documentElement
  }

  function u(e) {
    return s(c(e)).left + o(e).scrollLeft
  }

  function d(e) {
    return t(e).getComputedStyle(e)
  }

  function h(e) {
    var t = d(e),
      n = t.overflow,
      i = t.overflowX,
      a = t.overflowY;
    return /auto|scroll|overlay|hidden/.test(n + a + i)
  }

  function f(e, n, a) {
    void 0 === a && (a = !1);
    var r, d, f = i(n),
      p = i(n) && function (e) {
        var t = e.getBoundingClientRect(),
          n = t.width / e.offsetWidth || 1,
          i = t.height / e.offsetHeight || 1;
        return 1 !== n || 1 !== i
      }(n),
      m = c(n),
      g = s(e, p),
      v = {
        scrollLeft: 0,
        scrollTop: 0
      },
      y = {
        x: 0,
        y: 0
      };
    return (f || !f && !a) && (("body" !== l(n) || h(m)) && (v = (r = n) !== t(r) && i(r) ? {
      scrollLeft: (d = r).scrollLeft,
      scrollTop: d.scrollTop
    } : o(r)), i(n) ? ((y = s(n, !0)).x += n.clientLeft, y.y += n.clientTop) : m && (y.x = u(m))), {
      x: g.left + v.scrollLeft - y.x,
      y: g.top + v.scrollTop - y.y,
      width: g.width,
      height: g.height
    }
  }

  function p(e) {
    var t = s(e),
      n = e.offsetWidth,
      i = e.offsetHeight;
    return Math.abs(t.width - n) <= 1 && (n = t.width), Math.abs(t.height - i) <= 1 && (i = t.height), {
      x: e.offsetLeft,
      y: e.offsetTop,
      width: n,
      height: i
    }
  }

  function m(e) {
    return "html" === l(e) ? e : e.assignedSlot || e.parentNode || (a(e) ? e.host : null) || c(e)
  }

  function g(e) {
    return ["html", "body", "#document"].indexOf(l(e)) >= 0 ? e.ownerDocument.body : i(e) && h(e) ? e : g(m(e))
  }

  function v(e, n) {
    var i;
    void 0 === n && (n = []);
    var a = g(e),
      r = a === (null == (i = e.ownerDocument) ? void 0 : i.body),
      s = t(a),
      o = r ? [s].concat(s.visualViewport || [], h(a) ? a : []) : a,
      l = n.concat(o);
    return r ? l : l.concat(v(m(o)))
  }

  function y(e) {
    return ["table", "td", "th"].indexOf(l(e)) >= 0
  }

  function b(e) {
    return i(e) && "fixed" !== d(e).position ? e.offsetParent : null
  }

  function x(e) {
    for (var n = t(e), a = b(e); a && y(a) && "static" === d(a).position;) a = b(a);
    return a && ("html" === l(a) || "body" === l(a) && "static" === d(a).position) ? n : a || function (e) {
      var t = -1 !== navigator.userAgent.toLowerCase().indexOf("firefox");
      if (-1 !== navigator.userAgent.indexOf("Trident") && i(e) && "fixed" === d(e).position) return null;
      for (var n = m(e); i(n) && ["html", "body"].indexOf(l(n)) < 0;) {
        var a = d(n);
        if ("none" !== a.transform || "none" !== a.perspective || "paint" === a.contain || -1 !== ["transform", "perspective"].indexOf(a.willChange) || t && "filter" === a.willChange || t && a.filter && "none" !== a.filter) return n;
        n = n.parentNode
      }
      return null
    }(e) || n
  }
  var _ = "top",
    w = "bottom",
    k = "right",
    M = "left",
    L = "auto",
    S = [_, w, k, M],
    A = "start",
    T = "end",
    C = "viewport",
    D = "popper",
    E = S.reduce((function (e, t) {
      return e.concat([t + "-" + A, t + "-" + T])
    }), []),
    O = [].concat(S, [L]).reduce((function (e, t) {
      return e.concat([t, t + "-" + A, t + "-" + T])
    }), []),
    P = ["beforeRead", "read", "afterRead", "beforeMain", "main", "afterMain", "beforeWrite", "write", "afterWrite"];

  function Y(e) {
    var t = new Map,
      n = new Set,
      i = [];

    function a(e) {
      n.add(e.name), [].concat(e.requires || [], e.requiresIfExists || []).forEach((function (e) {
        if (!n.has(e)) {
          var i = t.get(e);
          i && a(i)
        }
      })), i.push(e)
    }
    return e.forEach((function (e) {
      t.set(e.name, e)
    })), e.forEach((function (e) {
      n.has(e.name) || a(e)
    })), i
  }

  function I(e) {
    for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) n[i - 1] = arguments[i];
    return [].concat(n).reduce((function (e, t) {
      return e.replace(/%s/, t)
    }), e)
  }
  var j = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s',
    N = ["name", "enabled", "phase", "fn", "effect", "requires", "options"];

  function H(e) {
    return e.split("-")[0]
  }
  var F = Math.max,
    R = Math.min,
    z = Math.round;

  function B(e, t) {
    var n = t.getRootNode && t.getRootNode();
    if (e.contains(t)) return !0;
    if (n && a(n)) {
      var i = t;
      do {
        if (i && e.isSameNode(i)) return !0;
        i = i.parentNode || i.host
      } while (i)
    }
    return !1
  }

  function W(e) {
    return Object.assign({}, e, {
      left: e.x,
      top: e.y,
      right: e.x + e.width,
      bottom: e.y + e.height
    })
  }

  function V(e, n) {
    return n === C ? W(function (e) {
      var n = t(e),
        i = c(e),
        a = n.visualViewport,
        r = i.clientWidth,
        s = i.clientHeight,
        o = 0,
        l = 0;
      return a && (r = a.width, s = a.height, /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || (o = a.offsetLeft, l = a.offsetTop)), {
        width: r,
        height: s,
        x: o + u(e),
        y: l
      }
    }(e)) : i(n) ? function (e) {
      var t = s(e);
      return t.top = t.top + e.clientTop, t.left = t.left + e.clientLeft, t.bottom = t.top + e.clientHeight, t.right = t.left + e.clientWidth, t.width = e.clientWidth, t.height = e.clientHeight, t.x = t.left, t.y = t.top, t
    }(n) : W(function (e) {
      var t, n = c(e),
        i = o(e),
        a = null == (t = e.ownerDocument) ? void 0 : t.body,
        r = F(n.scrollWidth, n.clientWidth, a ? a.scrollWidth : 0, a ? a.clientWidth : 0),
        s = F(n.scrollHeight, n.clientHeight, a ? a.scrollHeight : 0, a ? a.clientHeight : 0),
        l = -i.scrollLeft + u(e),
        h = -i.scrollTop;
      return "rtl" === d(a || n).direction && (l += F(n.clientWidth, a ? a.clientWidth : 0) - r), {
        width: r,
        height: s,
        x: l,
        y: h
      }
    }(c(e)))
  }

  function q(e, t, a) {
    var r = "clippingParents" === t ? function (e) {
        var t = v(m(e)),
          a = ["absolute", "fixed"].indexOf(d(e).position) >= 0 && i(e) ? x(e) : e;
        return n(a) ? t.filter((function (e) {
          return n(e) && B(e, a) && "body" !== l(e)
        })) : []
      }(e) : [].concat(t),
      s = [].concat(r, [a]),
      o = s[0],
      c = s.reduce((function (t, n) {
        var i = V(e, n);
        return t.top = F(i.top, t.top), t.right = R(i.right, t.right), t.bottom = R(i.bottom, t.bottom), t.left = F(i.left, t.left), t
      }), V(e, o));
    return c.width = c.right - c.left, c.height = c.bottom - c.top, c.x = c.left, c.y = c.top, c
  }

  function X(e) {
    return e.split("-")[1]
  }

  function U(e) {
    return ["top", "bottom"].indexOf(e) >= 0 ? "x" : "y"
  }

  function $(e) {
    var t, n = e.reference,
      i = e.element,
      a = e.placement,
      r = a ? H(a) : null,
      s = a ? X(a) : null,
      o = n.x + n.width / 2 - i.width / 2,
      l = n.y + n.height / 2 - i.height / 2;
    switch (r) {
      case _:
        t = {
          x: o,
          y: n.y - i.height
        };
        break;
      case w:
        t = {
          x: o,
          y: n.y + n.height
        };
        break;
      case k:
        t = {
          x: n.x + n.width,
          y: l
        };
        break;
      case M:
        t = {
          x: n.x - i.width,
          y: l
        };
        break;
      default:
        t = {
          x: n.x,
          y: n.y
        }
    }
    var c = r ? U(r) : null;
    if (null != c) {
      var u = "y" === c ? "height" : "width";
      switch (s) {
        case A:
          t[c] = t[c] - (n[u] / 2 - i[u] / 2);
          break;
        case T:
          t[c] = t[c] + (n[u] / 2 - i[u] / 2)
      }
    }
    return t
  }

  function G(e) {
    return Object.assign({}, {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }, e)
  }

  function Z(e, t) {
    return t.reduce((function (t, n) {
      return t[n] = e, t
    }), {})
  }

  function K(e, t) {
    void 0 === t && (t = {});
    var i = t,
      a = i.placement,
      r = void 0 === a ? e.placement : a,
      o = i.boundary,
      l = void 0 === o ? "clippingParents" : o,
      u = i.rootBoundary,
      d = void 0 === u ? C : u,
      h = i.elementContext,
      f = void 0 === h ? D : h,
      p = i.altBoundary,
      m = void 0 !== p && p,
      g = i.padding,
      v = void 0 === g ? 0 : g,
      y = G("number" != typeof v ? v : Z(v, S)),
      b = f === D ? "reference" : D,
      x = e.rects.popper,
      M = e.elements[m ? b : f],
      L = q(n(M) ? M : M.contextElement || c(e.elements.popper), l, d),
      A = s(e.elements.reference),
      T = $({
        reference: A,
        element: x,
        strategy: "absolute",
        placement: r
      }),
      E = W(Object.assign({}, x, T)),
      O = f === D ? E : A,
      P = {
        top: L.top - O.top + y.top,
        bottom: O.bottom - L.bottom + y.bottom,
        left: L.left - O.left + y.left,
        right: O.right - L.right + y.right
      },
      Y = e.modifiersData.offset;
    if (f === D && Y) {
      var I = Y[r];
      Object.keys(P).forEach((function (e) {
        var t = [k, w].indexOf(e) >= 0 ? 1 : -1,
          n = [_, w].indexOf(e) >= 0 ? "y" : "x";
        P[e] += I[n] * t
      }))
    }
    return P
  }
  var J = "Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.",
    Q = {
      placement: "bottom",
      modifiers: [],
      strategy: "absolute"
    };

  function ee() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
    return !t.some((function (e) {
      return !(e && "function" == typeof e.getBoundingClientRect)
    }))
  }

  function te(e) {
    void 0 === e && (e = {});
    var t = e,
      i = t.defaultModifiers,
      a = void 0 === i ? [] : i,
      r = t.defaultOptions,
      s = void 0 === r ? Q : r;
    return function (e, t, i) {
      void 0 === i && (i = s);
      var r, o, l = {
          placement: "bottom",
          orderedModifiers: [],
          options: Object.assign({}, Q, s),
          modifiersData: {},
          elements: {
            reference: e,
            popper: t
          },
          attributes: {},
          styles: {}
        },
        c = [],
        u = !1,
        h = {
          state: l,
          setOptions: function (i) {
            var r = "function" == typeof i ? i(l.options) : i;
            m(), l.options = Object.assign({}, s, l.options, r), l.scrollParents = {
              reference: n(e) ? v(e) : e.contextElement ? v(e.contextElement) : [],
              popper: v(t)
            };
            var o = function (e) {
              var t = Y(e);
              return P.reduce((function (e, n) {
                return e.concat(t.filter((function (e) {
                  return e.phase === n
                })))
              }), [])
            }(function (e) {
              var t = e.reduce((function (e, t) {
                var n = e[t.name];
                return e[t.name] = n ? Object.assign({}, n, t, {
                  options: Object.assign({}, n.options, t.options),
                  data: Object.assign({}, n.data, t.data)
                }) : t, e
              }), {});
              return Object.keys(t).map((function (e) {
                return t[e]
              }))
            }([].concat(a, l.options.modifiers)));
            (l.orderedModifiers = o.filter((function (e) {
              return e.enabled
            })), function (e) {
              e.forEach((function (t) {
                [].concat(Object.keys(t), N).filter((function (e, t, n) {
                  return n.indexOf(e) === t
                })).forEach((function (n) {
                  switch (n) {
                    case "name":
                      "string" != typeof t.name && console.error(I(j, String(t.name), '"name"', '"string"', '"' + String(t.name) + '"'));
                      break;
                    case "enabled":
                      "boolean" != typeof t.enabled && console.error(I(j, t.name, '"enabled"', '"boolean"', '"' + String(t.enabled) + '"'));
                      break;
                    case "phase":
                      P.indexOf(t.phase) < 0 && console.error(I(j, t.name, '"phase"', "either " + P.join(", "), '"' + String(t.phase) + '"'));
                      break;
                    case "fn":
                      "function" != typeof t.fn && console.error(I(j, t.name, '"fn"', '"function"', '"' + String(t.fn) + '"'));
                      break;
                    case "effect":
                      null != t.effect && "function" != typeof t.effect && console.error(I(j, t.name, '"effect"', '"function"', '"' + String(t.fn) + '"'));
                      break;
                    case "requires":
                      null == t.requires || Array.isArray(t.requires) || console.error(I(j, t.name, '"requires"', '"array"', '"' + String(t.requires) + '"'));
                      break;
                    case "requiresIfExists":
                      Array.isArray(t.requiresIfExists) || console.error(I(j, t.name, '"requiresIfExists"', '"array"', '"' + String(t.requiresIfExists) + '"'));
                      break;
                    case "options":
                    case "data":
                      break;
                    default:
                      console.error('PopperJS: an invalid property has been provided to the "' + t.name + '" modifier, valid properties are ' + N.map((function (e) {
                        return '"' + e + '"'
                      })).join(", ") + '; but "' + n + '" was provided.')
                  }
                  t.requires && t.requires.forEach((function (n) {
                    null == e.find((function (e) {
                      return e.name === n
                    })) && console.error(I('Popper: modifier "%s" requires "%s", but "%s" modifier is not available', String(t.name), n, n))
                  }))
                }))
              }))
            }((u = [].concat(o, l.options.modifiers), f = function (e) {
              return e.name
            }, p = new Set, u.filter((function (e) {
              var t = f(e);
              if (!p.has(t)) return p.add(t), !0
            })))), H(l.options.placement) === L) && (l.orderedModifiers.find((function (e) {
              return "flip" === e.name
            })) || console.error(['Popper: "auto" placements require the "flip" modifier be', "present and enabled to work."].join(" ")));
            var u, f, p, g = d(t);
            return [g.marginTop, g.marginRight, g.marginBottom, g.marginLeft].some((function (e) {
              return parseFloat(e)
            })) && console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', "between the popper and its reference element or boundary.", "To replicate margin, use the `offset` modifier, as well as", "the `padding` option in the `preventOverflow` and `flip`", "modifiers."].join(" ")), l.orderedModifiers.forEach((function (e) {
              var t = e.name,
                n = e.options,
                i = void 0 === n ? {} : n,
                a = e.effect;
              if ("function" == typeof a) {
                var r = a({
                    state: l,
                    name: t,
                    instance: h,
                    options: i
                  }),
                  s = function () {};
                c.push(r || s)
              }
            })), h.update()
          },
          forceUpdate: function () {
            if (!u) {
              var e = l.elements,
                t = e.reference,
                n = e.popper;
              if (ee(t, n)) {
                l.rects = {
                  reference: f(t, x(n), "fixed" === l.options.strategy),
                  popper: p(n)
                }, l.reset = !1, l.placement = l.options.placement, l.orderedModifiers.forEach((function (e) {
                  return l.modifiersData[e.name] = Object.assign({}, e.data)
                }));
                for (var i = 0, a = 0; a < l.orderedModifiers.length; a++) {
                  if ((i += 1) > 100) {
                    console.error("Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.");
                    break
                  }
                  if (!0 !== l.reset) {
                    var r = l.orderedModifiers[a],
                      s = r.fn,
                      o = r.options,
                      c = void 0 === o ? {} : o,
                      d = r.name;
                    "function" == typeof s && (l = s({
                      state: l,
                      options: c,
                      name: d,
                      instance: h
                    }) || l)
                  } else l.reset = !1, a = -1
                }
              } else console.error(J)
            }
          },
          update: (r = function () {
            return new Promise((function (e) {
              h.forceUpdate(), e(l)
            }))
          }, function () {
            return o || (o = new Promise((function (e) {
              Promise.resolve().then((function () {
                o = void 0, e(r())
              }))
            }))), o
          }),
          destroy: function () {
            m(), u = !0
          }
        };
      if (!ee(e, t)) return console.error(J), h;

      function m() {
        c.forEach((function (e) {
          return e()
        })), c = []
      }
      return h.setOptions(i).then((function (e) {
        !u && i.onFirstUpdate && i.onFirstUpdate(e)
      })), h
    }
  }
  var ne = {
    passive: !0
  };
  var ie = {
    name: "eventListeners",
    enabled: !0,
    phase: "write",
    fn: function () {},
    effect: function (e) {
      var n = e.state,
        i = e.instance,
        a = e.options,
        r = a.scroll,
        s = void 0 === r || r,
        o = a.resize,
        l = void 0 === o || o,
        c = t(n.elements.popper),
        u = [].concat(n.scrollParents.reference, n.scrollParents.popper);
      return s && u.forEach((function (e) {
          e.addEventListener("scroll", i.update, ne)
        })), l && c.addEventListener("resize", i.update, ne),
        function () {
          s && u.forEach((function (e) {
            e.removeEventListener("scroll", i.update, ne)
          })), l && c.removeEventListener("resize", i.update, ne)
        }
    },
    data: {}
  };
  var ae = {
      name: "popperOffsets",
      enabled: !0,
      phase: "read",
      fn: function (e) {
        var t = e.state,
          n = e.name;
        t.modifiersData[n] = $({
          reference: t.rects.reference,
          element: t.rects.popper,
          strategy: "absolute",
          placement: t.placement
        })
      },
      data: {}
    },
    re = {
      top: "auto",
      right: "auto",
      bottom: "auto",
      left: "auto"
    };

  function se(e) {
    var n, i = e.popper,
      a = e.popperRect,
      r = e.placement,
      s = e.variation,
      o = e.offsets,
      l = e.position,
      u = e.gpuAcceleration,
      h = e.adaptive,
      f = e.roundOffsets,
      p = !0 === f ? function (e) {
        var t = e.x,
          n = e.y,
          i = window.devicePixelRatio || 1;
        return {
          x: z(z(t * i) / i) || 0,
          y: z(z(n * i) / i) || 0
        }
      }(o) : "function" == typeof f ? f(o) : o,
      m = p.x,
      g = void 0 === m ? 0 : m,
      v = p.y,
      y = void 0 === v ? 0 : v,
      b = o.hasOwnProperty("x"),
      L = o.hasOwnProperty("y"),
      S = M,
      A = _,
      C = window;
    if (h) {
      var D = x(i),
        E = "clientHeight",
        O = "clientWidth";
      D === t(i) && "static" !== d(D = c(i)).position && "absolute" === l && (E = "scrollHeight", O = "scrollWidth"), D = D, r !== _ && (r !== M && r !== k || s !== T) || (A = w, y -= D[E] - a.height, y *= u ? 1 : -1), r !== M && (r !== _ && r !== w || s !== T) || (S = k, g -= D[O] - a.width, g *= u ? 1 : -1)
    }
    var P, Y = Object.assign({
      position: l
    }, h && re);
    return u ? Object.assign({}, Y, ((P = {})[A] = L ? "0" : "", P[S] = b ? "0" : "", P.transform = (C.devicePixelRatio || 1) <= 1 ? "translate(" + g + "px, " + y + "px)" : "translate3d(" + g + "px, " + y + "px, 0)", P)) : Object.assign({}, Y, ((n = {})[A] = L ? y + "px" : "", n[S] = b ? g + "px" : "", n.transform = "", n))
  }
  var oe = {
    name: "computeStyles",
    enabled: !0,
    phase: "beforeWrite",
    fn: function (e) {
      var t = e.state,
        n = e.options,
        i = n.gpuAcceleration,
        a = void 0 === i || i,
        r = n.adaptive,
        s = void 0 === r || r,
        o = n.roundOffsets,
        l = void 0 === o || o,
        c = d(t.elements.popper).transitionProperty || "";
      s && ["transform", "top", "right", "bottom", "left"].some((function (e) {
        return c.indexOf(e) >= 0
      })) && console.warn(["Popper: Detected CSS transitions on at least one of the following", 'CSS properties: "transform", "top", "right", "bottom", "left".', "\n\n", 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', "for smooth transitions, or remove these properties from the CSS", "transition declaration on the popper element if only transitioning", "opacity or background-color for example.", "\n\n", "We recommend using the popper element as a wrapper around an inner", "element that can have any CSS property transitioned for animations."].join(" "));
      var u = {
        placement: H(t.placement),
        variation: X(t.placement),
        popper: t.elements.popper,
        popperRect: t.rects.popper,
        gpuAcceleration: a
      };
      null != t.modifiersData.popperOffsets && (t.styles.popper = Object.assign({}, t.styles.popper, se(Object.assign({}, u, {
        offsets: t.modifiersData.popperOffsets,
        position: t.options.strategy,
        adaptive: s,
        roundOffsets: l
      })))), null != t.modifiersData.arrow && (t.styles.arrow = Object.assign({}, t.styles.arrow, se(Object.assign({}, u, {
        offsets: t.modifiersData.arrow,
        position: "absolute",
        adaptive: !1,
        roundOffsets: l
      })))), t.attributes.popper = Object.assign({}, t.attributes.popper, {
        "data-popper-placement": t.placement
      })
    },
    data: {}
  };
  var le = {
    name: "applyStyles",
    enabled: !0,
    phase: "write",
    fn: function (e) {
      var t = e.state;
      Object.keys(t.elements).forEach((function (e) {
        var n = t.styles[e] || {},
          a = t.attributes[e] || {},
          r = t.elements[e];
        i(r) && l(r) && (Object.assign(r.style, n), Object.keys(a).forEach((function (e) {
          var t = a[e];
          !1 === t ? r.removeAttribute(e) : r.setAttribute(e, !0 === t ? "" : t)
        })))
      }))
    },
    effect: function (e) {
      var t = e.state,
        n = {
          popper: {
            position: t.options.strategy,
            left: "0",
            top: "0",
            margin: "0"
          },
          arrow: {
            position: "absolute"
          },
          reference: {}
        };
      return Object.assign(t.elements.popper.style, n.popper), t.styles = n, t.elements.arrow && Object.assign(t.elements.arrow.style, n.arrow),
        function () {
          Object.keys(t.elements).forEach((function (e) {
            var a = t.elements[e],
              r = t.attributes[e] || {},
              s = Object.keys(t.styles.hasOwnProperty(e) ? t.styles[e] : n[e]).reduce((function (e, t) {
                return e[t] = "", e
              }), {});
            i(a) && l(a) && (Object.assign(a.style, s), Object.keys(r).forEach((function (e) {
              a.removeAttribute(e)
            })))
          }))
        }
    },
    requires: ["computeStyles"]
  };
  var ce = {
      name: "offset",
      enabled: !0,
      phase: "main",
      requires: ["popperOffsets"],
      fn: function (e) {
        var t = e.state,
          n = e.options,
          i = e.name,
          a = n.offset,
          r = void 0 === a ? [0, 0] : a,
          s = O.reduce((function (e, n) {
            return e[n] = function (e, t, n) {
              var i = H(e),
                a = [M, _].indexOf(i) >= 0 ? -1 : 1,
                r = "function" == typeof n ? n(Object.assign({}, t, {
                  placement: e
                })) : n,
                s = r[0],
                o = r[1];
              return s = s || 0, o = (o || 0) * a, [M, k].indexOf(i) >= 0 ? {
                x: o,
                y: s
              } : {
                x: s,
                y: o
              }
            }(n, t.rects, r), e
          }), {}),
          o = s[t.placement],
          l = o.x,
          c = o.y;
        null != t.modifiersData.popperOffsets && (t.modifiersData.popperOffsets.x += l, t.modifiersData.popperOffsets.y += c), t.modifiersData[i] = s
      }
    },
    ue = {
      left: "right",
      right: "left",
      bottom: "top",
      top: "bottom"
    };

  function de(e) {
    return e.replace(/left|right|bottom|top/g, (function (e) {
      return ue[e]
    }))
  }
  var he = {
    start: "end",
    end: "start"
  };

  function fe(e) {
    return e.replace(/start|end/g, (function (e) {
      return he[e]
    }))
  }

  function pe(e, t) {
    void 0 === t && (t = {});
    var n = t,
      i = n.placement,
      a = n.boundary,
      r = n.rootBoundary,
      s = n.padding,
      o = n.flipVariations,
      l = n.allowedAutoPlacements,
      c = void 0 === l ? O : l,
      u = X(i),
      d = u ? o ? E : E.filter((function (e) {
        return X(e) === u
      })) : S,
      h = d.filter((function (e) {
        return c.indexOf(e) >= 0
      }));
    0 === h.length && (h = d, console.error(["Popper: The `allowedAutoPlacements` option did not allow any", "placements. Ensure the `placement` option matches the variation", "of the allowed placements.", 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.'].join(" ")));
    var f = h.reduce((function (t, n) {
      return t[n] = K(e, {
        placement: n,
        boundary: a,
        rootBoundary: r,
        padding: s
      })[H(n)], t
    }), {});
    return Object.keys(f).sort((function (e, t) {
      return f[e] - f[t]
    }))
  }
  var me = {
    name: "flip",
    enabled: !0,
    phase: "main",
    fn: function (e) {
      var t = e.state,
        n = e.options,
        i = e.name;
      if (!t.modifiersData[i]._skip) {
        for (var a = n.mainAxis, r = void 0 === a || a, s = n.altAxis, o = void 0 === s || s, l = n.fallbackPlacements, c = n.padding, u = n.boundary, d = n.rootBoundary, h = n.altBoundary, f = n.flipVariations, p = void 0 === f || f, m = n.allowedAutoPlacements, g = t.options.placement, v = H(g), y = l || (v === g || !p ? [de(g)] : function (e) {
            if (H(e) === L) return [];
            var t = de(e);
            return [fe(e), t, fe(t)]
          }(g)), b = [g].concat(y).reduce((function (e, n) {
            return e.concat(H(n) === L ? pe(t, {
              placement: n,
              boundary: u,
              rootBoundary: d,
              padding: c,
              flipVariations: p,
              allowedAutoPlacements: m
            }) : n)
          }), []), x = t.rects.reference, S = t.rects.popper, T = new Map, C = !0, D = b[0], E = 0; E < b.length; E++) {
          var O = b[E],
            P = H(O),
            Y = X(O) === A,
            I = [_, w].indexOf(P) >= 0,
            j = I ? "width" : "height",
            N = K(t, {
              placement: O,
              boundary: u,
              rootBoundary: d,
              altBoundary: h,
              padding: c
            }),
            F = I ? Y ? k : M : Y ? w : _;
          x[j] > S[j] && (F = de(F));
          var R = de(F),
            z = [];
          if (r && z.push(N[P] <= 0), o && z.push(N[F] <= 0, N[R] <= 0), z.every((function (e) {
              return e
            }))) {
            D = O, C = !1;
            break
          }
          T.set(O, z)
        }
        if (C)
          for (var B = function (e) {
              var t = b.find((function (t) {
                var n = T.get(t);
                if (n) return n.slice(0, e).every((function (e) {
                  return e
                }))
              }));
              if (t) return D = t, "break"
            }, W = p ? 3 : 1; W > 0; W--) {
            if ("break" === B(W)) break
          }
        t.placement !== D && (t.modifiersData[i]._skip = !0, t.placement = D, t.reset = !0)
      }
    },
    requiresIfExists: ["offset"],
    data: {
      _skip: !1
    }
  };

  function ge(e, t, n) {
    return F(e, R(t, n))
  }
  var ve = {
    name: "preventOverflow",
    enabled: !0,
    phase: "main",
    fn: function (e) {
      var t = e.state,
        n = e.options,
        i = e.name,
        a = n.mainAxis,
        r = void 0 === a || a,
        s = n.altAxis,
        o = void 0 !== s && s,
        l = n.boundary,
        c = n.rootBoundary,
        u = n.altBoundary,
        d = n.padding,
        h = n.tether,
        f = void 0 === h || h,
        m = n.tetherOffset,
        g = void 0 === m ? 0 : m,
        v = K(t, {
          boundary: l,
          rootBoundary: c,
          padding: d,
          altBoundary: u
        }),
        y = H(t.placement),
        b = X(t.placement),
        L = !b,
        S = U(y),
        T = "x" === S ? "y" : "x",
        C = t.modifiersData.popperOffsets,
        D = t.rects.reference,
        E = t.rects.popper,
        O = "function" == typeof g ? g(Object.assign({}, t.rects, {
          placement: t.placement
        })) : g,
        P = {
          x: 0,
          y: 0
        };
      if (C) {
        if (r || o) {
          var Y = "y" === S ? _ : M,
            I = "y" === S ? w : k,
            j = "y" === S ? "height" : "width",
            N = C[S],
            z = C[S] + v[Y],
            B = C[S] - v[I],
            W = f ? -E[j] / 2 : 0,
            V = b === A ? D[j] : E[j],
            q = b === A ? -E[j] : -D[j],
            $ = t.elements.arrow,
            G = f && $ ? p($) : {
              width: 0,
              height: 0
            },
            Z = t.modifiersData["arrow#persistent"] ? t.modifiersData["arrow#persistent"].padding : {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            },
            J = Z[Y],
            Q = Z[I],
            ee = ge(0, D[j], G[j]),
            te = L ? D[j] / 2 - W - ee - J - O : V - ee - J - O,
            ne = L ? -D[j] / 2 + W + ee + Q + O : q + ee + Q + O,
            ie = t.elements.arrow && x(t.elements.arrow),
            ae = ie ? "y" === S ? ie.clientTop || 0 : ie.clientLeft || 0 : 0,
            re = t.modifiersData.offset ? t.modifiersData.offset[t.placement][S] : 0,
            se = C[S] + te - re - ae,
            oe = C[S] + ne - re;
          if (r) {
            var le = ge(f ? R(z, se) : z, N, f ? F(B, oe) : B);
            C[S] = le, P[S] = le - N
          }
          if (o) {
            var ce = "x" === S ? _ : M,
              ue = "x" === S ? w : k,
              de = C[T],
              he = de + v[ce],
              fe = de - v[ue],
              pe = ge(f ? R(he, se) : he, de, f ? F(fe, oe) : fe);
            C[T] = pe, P[T] = pe - de
          }
        }
        t.modifiersData[i] = P
      }
    },
    requiresIfExists: ["offset"]
  };
  var ye = {
    name: "arrow",
    enabled: !0,
    phase: "main",
    fn: function (e) {
      var t, n = e.state,
        i = e.name,
        a = e.options,
        r = n.elements.arrow,
        s = n.modifiersData.popperOffsets,
        o = H(n.placement),
        l = U(o),
        c = [M, k].indexOf(o) >= 0 ? "height" : "width";
      if (r && s) {
        var u = function (e, t) {
            return G("number" != typeof (e = "function" == typeof e ? e(Object.assign({}, t.rects, {
              placement: t.placement
            })) : e) ? e : Z(e, S))
          }(a.padding, n),
          d = p(r),
          h = "y" === l ? _ : M,
          f = "y" === l ? w : k,
          m = n.rects.reference[c] + n.rects.reference[l] - s[l] - n.rects.popper[c],
          g = s[l] - n.rects.reference[l],
          v = x(r),
          y = v ? "y" === l ? v.clientHeight || 0 : v.clientWidth || 0 : 0,
          b = m / 2 - g / 2,
          L = u[h],
          A = y - d[c] - u[f],
          T = y / 2 - d[c] / 2 + b,
          C = ge(L, T, A),
          D = l;
        n.modifiersData[i] = ((t = {})[D] = C, t.centerOffset = C - T, t)
      }
    },
    effect: function (e) {
      var t = e.state,
        n = e.options.element,
        a = void 0 === n ? "[data-popper-arrow]" : n;
      null != a && ("string" != typeof a || (a = t.elements.popper.querySelector(a))) && (i(a) || console.error(['Popper: "arrow" element must be an HTMLElement (not an SVGElement).', "To use an SVG arrow, wrap it in an HTMLElement that will be used as", "the arrow."].join(" ")), B(t.elements.popper, a) ? t.elements.arrow = a : console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', "element."].join(" ")))
    },
    requires: ["popperOffsets"],
    requiresIfExists: ["preventOverflow"]
  };

  function be(e, t, n) {
    return void 0 === n && (n = {
      x: 0,
      y: 0
    }), {
      top: e.top - t.height - n.y,
      right: e.right - t.width + n.x,
      bottom: e.bottom - t.height + n.y,
      left: e.left - t.width - n.x
    }
  }

  function xe(e) {
    return [_, k, w, M].some((function (t) {
      return e[t] >= 0
    }))
  }
  var _e = {
      name: "hide",
      enabled: !0,
      phase: "main",
      requiresIfExists: ["preventOverflow"],
      fn: function (e) {
        var t = e.state,
          n = e.name,
          i = t.rects.reference,
          a = t.rects.popper,
          r = t.modifiersData.preventOverflow,
          s = K(t, {
            elementContext: "reference"
          }),
          o = K(t, {
            altBoundary: !0
          }),
          l = be(s, i),
          c = be(o, a, r),
          u = xe(l),
          d = xe(c);
        t.modifiersData[n] = {
          referenceClippingOffsets: l,
          popperEscapeOffsets: c,
          isReferenceHidden: u,
          hasPopperEscaped: d
        }, t.attributes.popper = Object.assign({}, t.attributes.popper, {
          "data-popper-reference-hidden": u,
          "data-popper-escaped": d
        })
      }
    },
    we = te({
      defaultModifiers: [ie, ae, oe, le]
    }),
    ke = [ie, ae, oe, le, ce, me, ve, ye, _e],
    Me = te({
      defaultModifiers: ke
    });
  e.applyStyles = le, e.arrow = ye, e.computeStyles = oe, e.createPopper = Me, e.createPopperLite = we, e.defaultModifiers = ke, e.detectOverflow = K, e.eventListeners = ie, e.flip = me, e.hide = _e, e.offset = ce, e.popperGenerator = te, e.popperOffsets = ae, e.preventOverflow = ve, Object.defineProperty(e, "__esModule", {
    value: !0
  })
}))
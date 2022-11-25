!(function (e) {
  "use strict";
  function t(e, t, n) {
    for (
      var r = 0, i = e.toUpperCase(), o = n.toUpperCase();
      i[t + r] && i[t + r] == o[r];

    )
      r++;
    return e.substr(t, r);
  }
  function n(e, t) {
    var n = (e = e.substring(t)).match(/^\d+/);
    return n && n[0];
  }
  function r(e, t, n) {
    var r = i(e, t, n);
    return r.err &&
      "static" != t.type &&
      e.startsWith(t.placeholder, n) &&
      (r.err > 1 || r.viewValue.length <= t.placeholder.length)
      ? { empty: !0, viewValue: t.placeholder }
      : r;
  }
  function i(e, r, i) {
    var o, s, a, u;
    if ("static" == r.type)
      return e.startsWith(r.value, i)
        ? { viewValue: r.value }
        : { err: 2, code: "TEXT_MISMATCH", message: "Pattern value mismatch" };
    if ("number" == r.type)
      return null == (a = n(e, i))
        ? {
            err: 1,
            code: "NUMBER_MISMATCH",
            message: "Invalid number",
            viewValue: "",
          }
        : a.length < r.minLength
        ? {
            err: 1,
            code: "NUMBER_TOOSHORT",
            message: "The length of number is too short",
            value: +a,
            viewValue: a,
            properValue: w(+a, r.minLength, r.maxLength),
          }
        : (a.length > r.maxLength && (a = a.substr(0, r.maxLength)),
          +a < r.min
            ? {
                err: 1,
                code: "NUMBER_TOOSMALL",
                message: "The number is too small",
                value: +a,
                viewValue: a,
                properValue: w(r.min, r.minLength, r.maxLength),
              }
            : a.length > r.minLength && "0" == a[0]
            ? {
                err: 1,
                code: "LEADING_ZERO",
                message: "The number has too many leading zero",
                value: +a,
                viewValue: a,
                properValue: w(+a, r.minLength, r.maxLength),
              }
            : +a > r.max
            ? {
                err: 1,
                code: "NUMBER_TOOLARGE",
                message: "The number is too large",
                value: +a,
                viewValue: a,
                properValue: w(r.max, r.minLength, r.maxLength),
              }
            : { value: +a, viewValue: a });
    if ("select" == r.type) {
      for (s = "", u = 0; u < r.select.length; u++)
        (o = t(e, i, r.select[u])) && o.length > s.length && ((a = u), (s = o));
      return s
        ? s != r.select[a]
          ? {
              err: 1,
              code: "SELECT_INCOMPLETE",
              message: "Incomplete select",
              value: a + 1,
              viewValue: s,
              selected: r.select[a],
            }
          : { value: a + 1, viewValue: s }
        : {
            err: 1,
            code: "SELECT_MISMATCH",
            message: "Invalid select",
            viewValue: "",
          };
    }
    throw "Unknown token type: " + r.type;
  }
  function o(e, t) {
    for (
      var n,
        i,
        o = 0,
        s = [],
        a = e,
        u = Array.isArray(a),
        l = 0,
        a = u ? a : a[Symbol.iterator]();
      ;

    ) {
      if (u) {
        if (l >= a.length) break;
        n = a[l++];
      } else {
        if ((l = a.next()).done) break;
        n = l.value;
      }
      if (
        ((i = r(t, n.token, o)),
        (i.node = n),
        (i.pos = o),
        (i.token = n.token),
        i.err >= 2)
      )
        throw ((i.text = t), i);
      (o += i.viewValue.length), s.push(i);
    }
    var h = s[s.length - 1];
    if (h.pos + h.viewValue.length < t.length)
      throw { code: "TEXT_TOOLONG", message: "Text is too long", text: t };
    return s;
  }
  function s(e, t) {
    if ("static" == t.type) return { viewValue: t.value };
    var n = t.extract(e);
    if ("number" == t.type)
      return { value: n, viewValue: w(n, t.minLength, t.maxLength) };
    if ("select" == t.type) return { value: n, viewValue: t.select[n - 1] };
    throw "Unknown type to format: " + t.type;
  }
  function a(e, t, n) {
    for (
      var r,
        i,
        o = [],
        a = t,
        u = Array.isArray(a),
        l = 0,
        a = u ? a : a[Symbol.iterator]();
      ;

    ) {
      if (u) {
        if (l >= a.length) break;
        i = a[l++];
      } else {
        if ((l = a.next()).done) break;
        i = l.value;
      }
      (r = s(e, i.token)),
        "static" != i.token.type &&
          i.empty &&
          !n &&
          ((r.value = null), (r.viewValue = i.token.placeholder)),
        o.push(r);
    }
    return o;
  }
  function u(e, t, n, r) {
    return "object" == (void 0 === e ? "undefined" : v(e))
      ? (t.add(e, n, r), e)
      : t.add(e, n, r);
  }
  function l(e, t, n, r) {
    return "object" == (void 0 === e ? "undefined" : v(e))
      ? (t.restore(e, n, r), e)
      : t.restore(e, n, r);
  }
  function h(e, t) {
    for (
      var n,
        r,
        i,
        o = [],
        s = t,
        a = Array.isArray(s),
        u = 0,
        s = a ? s : s[Symbol.iterator]();
      ;

    ) {
      if (a) {
        if (u >= s.length) break;
        n = s[u++];
      } else {
        if ((u = s.next()).done) break;
        n = u.value;
      }
      o.push(new E(e, n));
    }
    for (r = 0; r < o.length; r++)
      (o[r].next = o[r + 1] || null), (o[r].prev = o[r - 1] || null);
    for (i = null, r = 0; r < o.length; r++)
      (o[r].prevEdit = i), "static" != o[r].token.type && (i = o[r]);
    for (i = null, r = o.length - 1; r >= 0; r--)
      (o[r].nextEdit = i), "static" != o[r].token.type && (i = o[r]);
    return o;
  }
  function c(e) {
    return e;
  }
  function d(e) {
    for (
      var t = new Map(),
        n = e,
        r = Array.isArray(n),
        i = 0,
        n = r ? n : n[Symbol.iterator]();
      ;

    ) {
      var o;
      if (r) {
        if (i >= n.length) break;
        o = n[i++];
      } else {
        if ((i = n.next()).done) break;
        o = i.value;
      }
      var s = o,
        a = t.get(s.token.name);
      a || ((a = []), t.set(s.token.name, a)), a.push(s);
    }
    return t;
  }
  function f(e, t) {
    if (t.length) {
      var n = p(t, e).map(function (e) {
          return e.node;
        }),
        r = n[0],
        i = n[1];
      return r == i
        ? r
        : e - r.offset - r.viewValue.length <= i.offset - e
        ? r
        : i;
    }
  }
  function p(e, t) {
    for (
      var n,
        r,
        i,
        o =
          arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : t,
        s = e,
        a = Array.isArray(s),
        u = 0,
        s = a ? s : s[Symbol.iterator]();
      ;

    ) {
      if (a) {
        if (u >= s.length) break;
        n = s[u++];
      } else {
        if ((u = s.next()).done) break;
        n = u.value;
      }
      n.offset <= t && (r = { node: n, pos: t - n.offset }),
        n.offset + n.viewValue.length >= o &&
          !i &&
          (i = { node: n, pos: o - n.offset });
    }
    if (!i) {
      var l = e[e.length - 1];
      i = { node: l, pos: l.viewValue.length };
    }
    return (
      r || (r = { node: e[0], pos: 0 }),
      r.pos > r.node.viewValue.length && (r.pos = r.node.viewValue.length),
      [r, i]
    );
  }
  function m(t, n) {
    function r(e) {
      var t,
        n = [];
      for (t = 1; t < e.length; t++) n.push(e[t]);
      return n.push(e[0]), n;
    }
    function i(t) {
      for (var n, r = [], i = 0; (n = c.exec(t)); )
        if (
          (n.index > i &&
            (r.push(e.extend({ value: t.substring(i, n.index) }, d.string)),
            (i = n.index)),
          n.index == i)
        ) {
          if (n[1]) r.push(e.extend({ value: n[1] }, d.string)), r.push(d.sss);
          else if (n[2])
            r.push(e.extend({ value: n[2].replace("''", "'") }, d.string));
          else if ("timezone" == d[n[0]].name) {
            var o = b;
            d[n[0]].colon && (o = s(o)),
              r.push(e.extend({ value: o }, d[n[0]]));
          } else r.push(d[n[0]]);
          i = c.lastIndex;
        }
      return (
        i < t.length && r.push(e.extend({ value: t.substring(i) }, d.string)), r
      );
    }
    function o(e) {
      var t = new Date(e.getFullYear(), 0, 1),
        n = new Date(t.getTime());
      n.getDay() > 4
        ? n.setDate(n.getDate() + (1 - n.getDay()) + 7)
        : n.setDate(n.getDate() + (1 - n.getDay()));
      var r = e.getTime() - n.getTime();
      return Math.floor(r / 6048e5);
    }
    function s(e) {
      return ":" == e[3] ? e : e.substr(0, 3) + ":" + e.substr(3, 2);
    }
    function a(e) {
      return ":" != e[3] ? e : e.substr(0, 3) + e.substr(4, 2);
    }
    function u(e, t) {
      var n = (60 * +(t = a(t)).substr(1, 2) + +t.substr(3, 2)) * (t[0] + "1");
      return new Date(e.getTime() + 60 * (n - -e.getTimezoneOffset()) * 1e3);
    }
    function l(e, t) {
      var n = (60 * +(t = a(t)).substr(1, 2) + +t.substr(3, 2)) * (t[0] + "1");
      return new Date(e.getTime() + 60 * (-e.getTimezoneOffset() - n) * 1e3);
    }
    var h = t.DATETIME_FORMATS,
      c =
        /yyyy|yy|y|M{1,4}|dd?|EEEE?|HH?|hh?|mm?|ss?|([.,])sss|a|Z{1,2}|ww|w|'(([^']+|'')*)'/g,
      d = {
        y: {
          minLength: 1,
          maxLength: 4,
          max: 9999,
          min: 0,
          name: "year",
          type: "number",
        },
        yy: { minLength: 2, maxLength: 2, name: "yearShort", type: "number" },
        yyyy: {
          minLength: 4,
          maxLength: 4,
          max: 9999,
          min: 0,
          name: "year",
          type: "number",
        },
        MMMM: { name: "month", type: "select", select: h.MONTH },
        MMM: { name: "month", type: "select", select: h.SHORTMONTH },
        MM: { minLength: 2, maxLength: 2, name: "month", type: "number" },
        M: {
          minLength: 1,
          maxLength: 2,
          name: "month",
          type: "number",
          min: 1,
        },
        dd: { minLength: 2, maxLength: 2, name: "date", type: "number" },
        d: { minLength: 1, maxLength: 2, name: "date", type: "number", min: 1 },
        EEEE: { name: "day", type: "select", select: r(h.DAY) },
        EEE: { name: "day", type: "select", select: r(h.SHORTDAY) },
        HH: { minLength: 2, maxLength: 2, name: "hour", type: "number" },
        H: { minLength: 1, maxLength: 2, name: "hour", type: "number" },
        hh: { minLength: 2, maxLength: 2, name: "hour12", type: "number" },
        h: { minLength: 1, maxLength: 2, name: "hour12", type: "number" },
        mm: { minLength: 2, maxLength: 2, name: "minute", type: "number" },
        m: { minLength: 1, maxLength: 2, name: "minute", type: "number" },
        ss: { minLength: 2, maxLength: 2, name: "second", type: "number" },
        s: { minLength: 1, maxLength: 2, name: "second", type: "number" },
        sss: {
          minLength: 3,
          maxLength: 3,
          name: "millisecond",
          type: "number",
        },
        a: { name: "ampm", type: "select", select: h.AMPMS },
        ww: {
          minLength: 2,
          maxLength: 2,
          max: 53,
          name: "week",
          type: "number",
        },
        w: {
          minLength: 1,
          maxLength: 2,
          max: 53,
          name: "week",
          type: "number",
        },
        Z: { name: "timezone", type: "static" },
        ZZ: { name: "timezone", type: "static", colon: !0 },
        string: { name: "string", type: "static" },
      },
      f = {
        year: {
          extract: function (e) {
            var t = e.getFullYear() % 1e4;
            return t >= 0 ? t : 0;
          },
          restore: function (e, t) {
            return e.setFullYear(t);
          },
          add: function (e, t) {
            return e.setFullYear(e.getFullYear() + t);
          },
          prior: 7,
        },
        yearShort: {
          extract: function (e) {
            var t = e.getFullYear() % 100;
            return t >= 0 ? t : t + 100;
          },
          restore: function (e, t) {
            return e.setFullYear(t);
          },
          add: function (e, t) {
            return e.setFullYear(e.getFullYear() + t);
          },
          prior: 7,
        },
        month: {
          extract: function (e) {
            return e.getMonth() + 1;
          },
          restore: function (e, t) {
            e.setMonth(t - 1), e.getMonth() == t && e.setDate(0);
          },
          add: function (e, t) {
            (t = e.getMonth() + t),
              e.setMonth(t),
              e.getMonth() == t + 1 && e.setDate(0);
          },
          prior: 5,
        },
        date: {
          extract: function (e) {
            return e.getDate();
          },
          restore: function (e, t, n) {
            var r = e.getMonth();
            if ((e.setDate(t), e.getMonth() != r && t <= 31)) {
              var i = n.getNodes("month");
              i &&
                i.every(function (e) {
                  return e.empty;
                }) &&
                e.setDate(t);
            }
          },
          add: function (e, t, n) {
            this.restore(e, e.getDate() + t, n);
          },
          prior: 4,
        },
        day: {
          extract: function (e) {
            return e.getDay() || 7;
          },
          restore: function (e, t) {
            var n = e.getMonth(),
              r = t - (e.getDay() || 7);
            e.setDate(e.getDate() + r),
              e.getMonth() != n &&
                (r > 0
                  ? e.setDate(e.getDate() - 7)
                  : e.setDate(e.getDate() + 7));
          },
          add: function (e, t) {
            return e.setDate(e.getDate() + t);
          },
          prior: 4,
        },
        hour: {
          extract: function (e) {
            return e.getHours();
          },
          restore: function (e, t) {
            return e.setHours(t);
          },
          add: function (e, t) {
            return e.setHours(e.getHours() + t);
          },
          prior: 2,
        },
        hour12: {
          extract: function (e) {
            return e.getHours() % 12 || 12;
          },
          restore: function (e, t) {
            (t %= 12), e.getHours() >= 12 && (t += 12), e.setHours(t);
          },
          add: function (e, t) {
            return e.setHours(e.getHours() + t);
          },
          prior: 2,
        },
        ampm: {
          extract: function (e) {
            return e.getHours() < 12 ? 1 : 2;
          },
          restore: function (e, t) {
            var n = e.getHours();
            n < 12 == t > 1 && e.setHours((n + 12) % 24);
          },
          add: function (e, t) {
            return e.setHours(e.getHours() + 12 * t);
          },
          prior: 3,
        },
        minute: {
          extract: function (e) {
            return e.getMinutes();
          },
          restore: function (e, t) {
            return e.setMinutes(t);
          },
          add: function (e, t) {
            return e.setMinutes(e.getMinutes() + t);
          },
          prior: 0,
        },
        second: {
          extract: function (e) {
            return e.getSeconds();
          },
          restore: function (e, t) {
            return e.setSeconds(t);
          },
          add: function (e, t) {
            return e.setSeconds(e.getSeconds() + t);
          },
          prior: 1,
        },
        millisecond: {
          extract: function (e) {
            return e.getMilliseconds();
          },
          restore: function (e, t) {
            return e.setMilliseconds(t);
          },
          add: function (e, t) {
            return e.setMilliseconds(e.getMilliseconds() + t);
          },
          prior: 1,
        },
        week: {
          extract: o,
          restore: function (e, t) {
            return e.setDate(e.getDate() + 7 * (t - o(e)));
          },
          add: function (e, t) {
            return e.setDate(e.getDate() + 7 * t);
          },
          prior: 6,
        },
      };
    for (var p in f) f[p].placeholder = n[p];
    for (
      var m = Object.values(d),
        g = Array.isArray(m),
        y = 0,
        m = g ? m : m[Symbol.iterator]();
      ;

    ) {
      var v;
      if (g) {
        if (y >= m.length) break;
        v = m[y++];
      } else {
        if ((y = m.next()).done) break;
        v = y.value;
      }
      var T = v;
      f[T.name] && e.extend(T, f[T.name]);
    }
    var b = (function () {
        var e = -new Date().getTimezoneOffset(),
          t = e >= 0 ? "+" : "-",
          n = Math.abs(e),
          r = Math.floor(n / 60),
          i = n % 60;
        return t + A(r, 2, 2) + A(i, 2, 2);
      })(),
      w = (function () {
        function e(t) {
          x(this, e),
            (this.tp = t),
            (this.timezone = b),
            (this.timezoneNodes = this.tp.nodes.filter(function (e) {
              return "timezone" == e.token.name;
            }));
        }
        return (
          (e.prototype.parse = function (e) {
            return this.tp.parse(e), this;
          }),
          (e.prototype.getText = function () {
            return this.tp.getText();
          }),
          (e.prototype.setDate = function (e, t) {
            return this.tp.setValue(u(e, this.timezone), t), this;
          }),
          (e.prototype.getDate = function () {
            return l(this.tp.getValue(), this.timezone);
          }),
          (e.prototype.setTimezone = function () {
            var e =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : b;
            if (e != this.timezone) {
              var t = this.getDate();
              this.timezone = e;
              for (
                var n = this.timezoneNodes,
                  r = Array.isArray(n),
                  i = 0,
                  n = r ? n : n[Symbol.iterator]();
                ;

              ) {
                var o;
                if (r) {
                  if (i >= n.length) break;
                  o = n[i++];
                } else {
                  if ((i = n.next()).done) break;
                  o = i.value;
                }
                var u = o;
                u.token.colon ? (u.token.value = s(e)) : (u.token.value = a(e));
              }
              return this.setDate(t, !1);
            }
          }),
          (e.prototype.isEmpty = function () {
            return this.tp.isEmpty.apply(this.tp, arguments);
          }),
          (e.prototype.isInit = function () {
            return this.tp.isInit.apply(this.tp, arguments);
          }),
          (e.prototype.unset = function () {
            return this.tp.unset(), this;
          }),
          e
        );
      })();
    return function (e) {
      var t,
        n = i(h[e] || e);
      t = n.some(function (e) {
        return "yearShort" == e.name;
      })
        ? function (e) {
            return function (t) {
              e.apply(this, arguments);
              var n = t.getFullYear();
              n < 0 && t.setFullYear(n + 100);
            };
          }
        : function (e) {
            return function (t) {
              e.apply(this, arguments);
              var n = t.getFullYear();
              n < 0 && t.setFullYear(0), n > 9999 && t.setFullYear(9999);
            };
          };
      for (
        var r = n,
          o = Array.isArray(r),
          s = 0,
          r = o ? r : r[Symbol.iterator]();
        ;

      ) {
        var a;
        if (o) {
          if (s >= r.length) break;
          a = r[s++];
        } else {
          if ((s = r.next()).done) break;
          a = s.value;
        }
        var u = a;
        u.add && (u.add = t(u.add)), u.restore && (u.restore = t(u.restore));
      }
      var l = new N({
        tokens: n,
        value: new Date(),
        copyValue: function (e) {
          return new Date(e.getTime());
        },
      });
      return new w(l);
    };
  }
  function g(t, n, r) {
    var i = (function () {
      function t(e, n) {
        x(this, t), (this.el = e), (this.doc = n);
      }
      return (
        (t.prototype.on = function (e, t) {
          if ("input" != e) return this.el.on(e, t);
        }),
        (t.prototype.getSelection = function () {
          var t = this.el[0];
          if (this.doc.activeElement == t) {
            var n = t.selectionStart,
              r = t.selectionEnd;
            return e.isDefined(n) && e.isDefined(r)
              ? { start: n, end: r }
              : this.getSelectionIE();
          }
        }),
        (t.prototype.getSelectionIE = function () {
          var e = this.el[0],
            t = this.doc.selection.createRange().getBookmark(),
            n = e.createTextRange(),
            r = n.duplicate();
          n.moveToBookmark(t), r.setEndPoint("EndToStart", n);
          var i = r.text.length;
          return { start: i, end: i + n.text.length };
        }),
        (t.prototype.setSelection = function (e, t) {
          var n = this.el[0];
          this.doc.activeElement == n &&
            (n.setSelectionRange
              ? n.setSelectionRange(e, t)
              : this.setSelectionIE(e, t));
        }),
        (t.prototype.setSelectionIE = function (e, t) {
          var n = this.el[0].createTextRange();
          n.moveStart("character", e),
            n.collapse(),
            n.moveEnd("character", t - e),
            n.select();
        }),
        (t.prototype.val = function () {
          var e;
          return (e = this.el).val.apply(e, arguments);
        }),
        t
      );
    })();
    return {
      restrict: "A",
      require: "?ngModel",
      link: function (n, o, s, a) {
        function u(e) {
          e && !p
            ? ((p = !0), m.setTimezone("+0000"), g && g.setTimezone("+0000"))
            : !e && p && ((p = !1), m.setTimezone(), g && g.setTimezone());
        }
        function l(e) {
          m.setTimezone(e), g && g.setTimezone(e);
        }
        function h(t) {
          return (
            !(!a.$isEmpty(t) && !a.$isEmpty(s.min)) ||
            (e.isDate(t) || (t = g.getDate()), t >= new Date(s.min))
          );
        }
        function c(t) {
          return (
            !(!a.$isEmpty(t) && !a.$isEmpty(s.max)) ||
            (e.isDate(t) || (t = g.getDate()), t <= new Date(s.max))
          );
        }
        function d(e) {
          return (
            a.$validate
              ? a.$validate()
              : (a.$setValidity("min", h(e)), a.$setValidity("max", c(e))),
            !a.$error.min && !a.$error.max
          );
        }
        function f(t) {
          return !(!e.isDate(t) || g) || !(!e.isString(t) || !g);
        }
        if (!a) return !1;
        s.ngTrim = "false";
        var p,
          m = t(s.datetime),
          g = s.datetimeModel && t(s.datetimeModel),
          y = new i(o, r[0]),
          v = new O(y, m.tp, s.datetimeSeparator);
        v.on("digest", function (e) {
          "NOT_INIT" != e.code && a.$setValidity("datetime", !1);
        }),
          m.tp.on("change", function () {
            n.$evalAsync(function () {
              v.err
                ? a.$setValidity("datetime", !1)
                : (m.isInit() || m.isEmpty()
                    ? a.$setValidity("datetime", !0)
                    : a.$setValidity("datetime", !1),
                  m.getText() != a.$viewValue && a.$setViewValue(m.getText()));
            });
          }),
          e.isDefined(s.datetimeUtc) &&
            (s.datetimeUtc.length > 0 ? n.$watch(s.datetimeUtc, u) : u(!0)),
          e.isDefined(s.datetimeTimezone) &&
            (/^[+-]\d{2}:?\d{2}$/.test(s.datetimeTimezone)
              ? l(s.datetimeTimezone)
              : n.$watch(s.datetimeTimezone, l)),
          a.$validators && ((a.$validators.min = h), (a.$validators.max = c)),
          s.$observe("min", function () {
            d(m.getDate());
          }),
          s.$observe("max", function () {
            d(m.getDate());
          }),
          (a.$render = function () {}),
          (a.$isEmpty = function (e) {
            return !e || ("string" == typeof e && m.isEmpty(e));
          }),
          a.$parsers.unshift(function (t) {
            if ((e.isUndefined(t) && (t = m.getText()), !e.isString(t)))
              return t;
            if ((v.digest(null, t), !m.isInit())) return undefined;
            var n = m.getDate();
            return a.$validate || d(n)
              ? g
                ? g.setDate(n).getText()
                : new Date(n.getTime())
              : undefined;
          }),
          a.$formatters.push(function (e) {
            return (
              a.$setValidity("datetime", !0),
              e
                ? f(e)
                  ? (g && (e = g.parse(e).getDate()),
                    a.$validate || d(e),
                    m.setDate(e).getText())
                  : e
                : (m.unset(),
                  n.$evalAsync(function () {
                    a.$setViewValue(m.getText());
                  }),
                  m.getText())
            );
          });
      },
      priority: 100,
    };
  }
  (e = e && e.hasOwnProperty("default") ? e["default"] : e).module(
    "datetime",
    []
  ),
    e
      .module("datetime")
      .constant("datetimePlaceholder", {
        year: "(year)",
        yearShort: "(year)",
        month: "(month)",
        date: "(date)",
        day: "(day)",
        hour: "(hour)",
        hour12: "(hour12)",
        minute: "(minute)",
        second: "(second)",
        millisecond: "(millisecond)",
        ampm: "(AM/PM)",
        week: "(week)",
      });
  var y = {
      num2str: function (e, t, n) {
        var r;
        if ((e = "" + e).length > n) e = e.substr(e.length - n);
        else if (e.length < t) for (r = e.length; r < t; r++) e = "0" + e;
        return e;
      },
      Emitter: (function (e, t) {
        return (t = { exports: {} }), e(t, t.exports), t.exports;
      })(function (e) {
        function t() {
          if (!(this instanceof t)) return new t();
        }
        !(function (t) {
          function n(e) {
            for (var t in s) e[t] = s[t];
            return e;
          }
          function r(e, t) {
            var n,
              s = this;
            if (arguments.length) {
              if (t) {
                if ((n = i(s, e, !0))) {
                  if (
                    !(n = n.filter(function (e) {
                      return e !== t && e.originalListener !== t;
                    })).length
                  )
                    return r.call(s, e);
                  s[o][e] = n;
                }
              } else if ((n = s[o]) && (delete n[e], !Object.keys(n).length))
                return r.call(s);
            } else delete s[o];
            return s;
          }
          function i(e, t, n) {
            if (!n || e[o]) {
              var r = e[o] || (e[o] = {});
              return r[t] || (r[t] = []);
            }
          }
          e.exports = t;
          var o = "listeners",
            s = {
              on: function (e, t) {
                return i(this, e).push(t), this;
              },
              once: function (e, t) {
                function n() {
                  r.call(o, e, n), t.apply(this, arguments);
                }
                var o = this;
                return (n.originalListener = t), i(o, e).push(n), o;
              },
              off: r,
              emit: function (e, t) {
                var n = this,
                  r = i(n, e, !0);
                if (!r) return !1;
                var o = arguments.length;
                if (1 === o)
                  r.forEach(function (e) {
                    e.call(n);
                  });
                else if (2 === o)
                  r.forEach(function (e) {
                    e.call(n, t);
                  });
                else {
                  var s = Array.prototype.slice.call(arguments, 1);
                  r.forEach(function (e) {
                    e.apply(n, s);
                  });
                }
                return !!r.length;
              },
            };
          n(t.prototype), (t.mixin = n);
        })(t);
      }),
    },
    v =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          },
    x = function (e, t) {
      if (!(e instanceof t))
        throw new TypeError("Cannot call a class as a function");
    },
    T = function (e, t) {
      if ("function" != typeof t && null !== t)
        throw new TypeError(
          "Super expression must either be null or a function, not " + typeof t
        );
      (e.prototype = Object.create(t && t.prototype, {
        constructor: {
          value: e,
          enumerable: !1,
          writable: !0,
          configurable: !0,
        },
      })),
        t &&
          (Object.setPrototypeOf
            ? Object.setPrototypeOf(e, t)
            : (e.__proto__ = t));
    },
    b = function (e, t) {
      if (!e)
        throw new ReferenceError(
          "this hasn't been initialised - super() hasn't been called"
        );
      return !t || ("object" != typeof t && "function" != typeof t) ? e : t;
    },
    w = y.num2str,
    k = y.Emitter,
    E = (function () {
      function e(t, n) {
        x(this, e),
          (this.parser = t),
          (this.token = n),
          (this.value = null),
          (this.viewValue = n.value),
          (this.offset = 0),
          (this.next = null),
          (this.prev = null),
          (this.nextEdit = null),
          (this.prevEdit = null),
          (this.empty = !0);
      }
      return (
        (e.prototype.unset = function () {
          "static" == this.token.type ||
            this.parser.noEmpty ||
            ((this.empty = !0), this.parser.setValue(this.parser.value, !1));
        }),
        (e.prototype.parse = function (e) {
          var t =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : 0,
            n = r(e, this.token, t);
          if (n.err) throw ((n.node = this), (n.token = this.token), n);
          if (this.parser.noEmpty && n.empty)
            throw {
              code: "NOT_INIT_FORBIDDEN",
              message: "Empty node is forbidden",
              node: this,
            };
          if (n.empty) this.unset();
          else {
            this.empty = !1;
            var i = l(
              this.parser.copyValue(this.parser.value),
              this.token,
              n.value,
              this.parser
            );
            this.parser.setValue(i, !1);
          }
        }),
        (e.prototype.add = function (e) {
          var t,
            n = this.parser.copyValue(this.parser.value);
          (this.empty = !1),
            (n = u(n, this.token, e, this.parser)),
            (t = this.token.extract(n));
          var r, i;
          "number" == this.token.type
            ? ((r = this.token.min), (i = this.token.max))
            : "select" == this.token.type &&
              ((r = 1), (i = this.token.select.length)),
            t < r && (n = l(n, this.token, r, this.parser)),
            t > i && (n = l(n, this.token, i, this.parser)),
            this.parser.setValue(n, !1);
        }),
        e
      );
    })(),
    V = {
      TextParser: (function (e) {
        function t() {
          x(this, t);
          var n = b(this, e.call(this));
          return n._constructor.apply(n, arguments), n.initialize(), n;
        }
        return (
          T(t, e),
          (t.prototype._constructor = function (e) {
            var t = e.tokens,
              n = e.noEmpty,
              r = n !== undefined && n,
              i = e.value,
              o = e.text,
              s = e.copyValue,
              a = s === undefined ? c : s;
            if (!t || !t.length) throw new Error("option.tokens is required");
            (this.tokens = t),
              (this.nodes = h(this, t)),
              (this.nameMap = d(this.nodes)),
              (this.value = i),
              (this.text = o),
              (this.noEmpty = r),
              (this.copyValue = a),
              (this.err = !1);
          }),
          (t.prototype.initialize = function () {
            this.setValue(this.value);
          }),
          (t.prototype.parse = function (e) {
            if (!e)
              throw {
                code: "EMPTY",
                message: "The input is empty",
                oldText: this.text,
              };
            var t, n;
            t = o(this.nodes, e);
            var r,
              i = [];
            for (
              r = this.err ? o(this.nodes, this.text) : this.nodes, n = 0;
              n < t.length;
              n++
            )
              t[n].empty ||
                t[n].viewValue == r[n].viewValue ||
                ((t[n].token = this.nodes[n].token), i.push(t[n]));
            var s = t.filter(function (e) {
                return e.empty;
              }),
              u = t.filter(function (e) {
                return e.err;
              });
            for (n = 0; n < t.length; n++)
              (this.nodes[n].value = t[n].value),
                (this.nodes[n].viewValue = t[n].viewValue),
                (this.nodes[n].offset = t[n].pos),
                (this.nodes[n].empty = t[n].empty);
            if (u.length) throw ((this.err = !0), u[0]);
            (this.err = !1),
              i.sort(function (e, t) {
                return t.empty
                  ? -1
                  : e.empty
                  ? 1
                  : (t.token.prior || 0) - (e.token.prior || 0);
              });
            for (
              var h,
                c = this.copyValue(this.value),
                d = i,
                f = Array.isArray(d),
                p = 0,
                d = f ? d : d[Symbol.iterator]();
              ;

            ) {
              if (f) {
                if (p >= d.length) break;
                h = d[p++];
              } else {
                if ((p = d.next()).done) break;
                h = p.value;
              }
              c = l(c, h.token, h.value, this);
            }
            var m = a(c, t)
              .map(function (e) {
                return e.viewValue;
              })
              .join("");
            if (e != m)
              throw (
                ((this.err = !0),
                {
                  code: "INCONSISTENT_INPUT",
                  message:
                    "Successfully parsed but the output text doesn't match the input",
                  text: e,
                  oldText: this.text,
                  properText: m,
                })
              );
            if (
              ((this.text = e),
              (this.value = c),
              this.emit("change", this.value),
              s.length)
            )
              throw {
                code: "NOT_INIT",
                message: "Some nodes are empty",
                text: e,
                node: s[0],
              };
            return this;
          }),
          (t.prototype.setValue = function (e) {
            var t,
              n =
                !(arguments.length > 1 && arguments[1] !== undefined) ||
                arguments[1],
              r = a(e, this.nodes, n),
              i = 0,
              o = "";
            for (t = 0; t < r.length; t++)
              (this.nodes[t].value = r[t].value),
                (this.nodes[t].viewValue = r[t].viewValue),
                (this.nodes[t].offset = i),
                (this.nodes[t].empty = !n && this.nodes[t].empty),
                (i += this.nodes[t].viewValue.length),
                (o += this.nodes[t].viewValue);
            return (
              (this.value = e),
              (this.text = o),
              this.emit("change", this.value),
              this
            );
          }),
          (t.prototype.isEmpty = function (e) {
            var t;
            if (e)
              try {
                t = o(this.nodes, e);
              } catch (r) {
                return !1;
              }
            else t = this.nodes;
            var n;
            for (n = 0; n < t.length; n++)
              if ("static" != this.nodes[n].token.type && !t[n].empty)
                return !1;
            return !0;
          }),
          (t.prototype.isInit = function () {
            for (
              var e,
                t = this.nodes,
                n = Array.isArray(t),
                r = 0,
                t = n ? t : t[Symbol.iterator]();
              ;

            ) {
              if (n) {
                if (r >= t.length) break;
                e = t[r++];
              } else {
                if ((r = t.next()).done) break;
                e = r.value;
              }
              if ("static" != e.token.type && e.empty) return !1;
            }
            return !0;
          }),
          (t.prototype.unset = function () {
            for (
              var e,
                t = this.nodes,
                n = Array.isArray(t),
                r = 0,
                t = n ? t : t[Symbol.iterator]();
              ;

            ) {
              if (n) {
                if (r >= t.length) break;
                e = t[r++];
              } else {
                if ((r = t.next()).done) break;
                e = r.value;
              }
              e.empty = !0;
            }
            return this.setValue(this.value, !1), this;
          }),
          (t.prototype.getText = function () {
            return this.text;
          }),
          (t.prototype.getValue = function () {
            return this.value;
          }),
          (t.prototype.getNodes = function (e) {
            return e ? this.nameMap.get(e) : this.nodes;
          }),
          t
        );
      })(k),
    },
    M = y.Emitter,
    D = (function () {
      function e(t, n) {
        x(this, e),
          (this.el = t),
          (this.nodes = n),
          (this.range = { node: f(0, this.nodes), start: 0, end: "end" });
      }
      return (
        (e.prototype.selectNearestNode = function () {
          var e = this.el.getSelection();
          e &&
            this.select({ node: f(e.start, this.nodes), start: 0, end: "end" });
        }),
        (e.prototype.select = function (e) {
          (e = Object.assign(this.range, e)).node &&
            this.el.setSelection(
              e.node.offset + e.start,
              e.node.offset + ("end" == e.end ? e.node.viewValue.length : e.end)
            );
        }),
        (e.prototype.hasNext = function () {
          if (this.range.node) return this.range.node.nextEdit;
        }),
        (e.prototype.hasPrev = function () {
          if (this.range.node) return this.range.node.prevEdit;
        }),
        (e.prototype.selectNext = function () {
          var e = this.hasNext(),
            t = { start: 0, end: "end" };
          e && (t.node = e), this.select(t);
        }),
        (e.prototype.selectPrev = function () {
          var e = this.hasPrev(),
            t = { start: 0, end: "end" };
          e && (t.node = e), this.select(t);
        }),
        (e.prototype.get = function () {
          if (this.nodes.length) {
            var e = this.el.getSelection();
            if (e) {
              var t = p(this.nodes, e.start, e.end),
                n = t[0],
                r = t[1];
              n.node == r.node &&
                (this.range = { node: n.node, start: n.pos, end: r.pos });
            }
          }
        }),
        (e.prototype.atNodeEnd = function () {
          if (this.range.node) {
            this.get();
            var e = this.range.node.viewValue.length,
              t = this.range.node.token.maxLength,
              n = "end" == this.range.start ? e : this.range.start;
            return (
              (n == ("end" == this.range.end ? e : this.range.end) &&
                n == (null != t ? t : e)) ||
              !e
            );
          }
        }),
        (e.prototype.atNodeStart = function () {
          if (this.range.node) {
            this.get();
            var e = this.range.node.viewValue.length,
              t = "end" == this.range.start ? e : this.range.start;
            return (
              t == ("end" == this.range.end ? e : this.range.end) && 0 == t
            );
          }
        }),
        e
      );
    })(),
    L = {
      InputMask: (function (e) {
        function t() {
          x(this, t);
          var n = b(this, e.call(this));
          return n._constructor.apply(n, arguments), n.initialize(), n;
        }
        return (
          T(t, e),
          (t.prototype._constructor = function (e, t) {
            var n =
              arguments.length > 2 && arguments[2] !== undefined
                ? arguments[2]
                : "";
            (this.el = e),
              (this.tp = t),
              (this.separators = n),
              (this.sel = new D(
                e,
                t.getNodes().filter(function (e) {
                  return "static" != e.token.type;
                })
              ));
          }),
          (t.prototype.initialize = function () {
            var e = this;
            this.el.on("mousedown", function () {
              e.mousedown = !0;
            }),
              this.el.on("focus", function () {
                e.mousedown ||
                  setTimeout(function () {
                    e.sel.select({ start: 0, end: "end" });
                  });
              }),
              this.el.on("click", function () {
                (e.mousedown = !1), e.sel.selectNearestNode();
              }),
              this.el.on("input", function () {
                e.digest(null, e.el.val());
              }),
              this.el.on("keydown", function (t) {
                t.altKey ||
                  t.ctrlKey ||
                  (37 == t.keyCode ||
                  (9 == t.keyCode && t.shiftKey && e.sel.hasPrev())
                    ? (t.preventDefault(),
                      e.tryFixingError(),
                      e.sel.selectPrev())
                    : 39 == t.keyCode ||
                      (9 == t.keyCode && !t.shiftKey && e.sel.hasNext())
                    ? (t.preventDefault(),
                      e.tryFixingError(),
                      e.sel.selectNext())
                    : 38 == t.keyCode
                    ? (t.preventDefault(),
                      e.sel.selectNearestNode(),
                      e.sel.range.node && e.sel.range.node.add(1),
                      e.val(e.tp.getText()),
                      e.sel.select({ start: 0, end: "end" }))
                    : 40 == t.keyCode
                    ? (t.preventDefault(),
                      e.sel.selectNearestNode(),
                      e.sel.range.node && e.sel.range.node.add(-1),
                      e.val(e.tp.getText()),
                      e.sel.select({ start: 0, end: "end" }))
                    : 36 == t.keyCode || 35 == t.keyCode
                    ? setTimeout(function () {
                        return e.sel.selectNearestNode();
                      })
                    : 46 == t.keyCode
                    ? e.sel.atNodeEnd() &&
                      (t.preventDefault(),
                      e.tryFixingError(),
                      e.sel.selectNext())
                    : 8 == t.keyCode &&
                      e.sel.atNodeStart() &&
                      (t.preventDefault(),
                      e.tryFixingError(),
                      e.sel.selectPrev()));
              }),
              this.el.on("keypress", function (t) {
                var n = null == t.charCode ? t.keyCode : t.charCode,
                  r = String.fromCharCode(n),
                  i = e.separators,
                  o = e.sel.range.node;
                if (
                  (o &&
                    o.next &&
                    "static" == o.next.token.type &&
                    (i += o.next.viewValue[0]),
                  i.includes(r))
                )
                  return (
                    t.preventDefault(),
                    e.tryFixingError(),
                    void e.sel.selectNext()
                  );
                setTimeout(function () {
                  e.sel.atNodeEnd() &&
                    e.sel.range.node.viewValue &&
                    (e.tryFixingError(), e.sel.selectNext());
                });
              }),
              this.el.on("blur", function () {
                setTimeout(function () {
                  e.tryFixingError();
                });
              }),
              this.tp.on("change", function () {
                e.err || e.inDigest || (e.val(e.tp.getText()), e.sel.select());
              });
            var t = this.el.val();
            t ? this.digest(null, t, !0) : this.val(this.tp.getText());
          }),
          (t.prototype.errorViewLength = function () {
            return this.err && null != this.err.viewValue
              ? this.err.viewValue.length
              : undefined;
          }),
          (t.prototype.val = function (e) {
            this.el.val() != e && this.el.val(e), (this.err = null);
          }),
          (t.prototype.tryFixingError = function () {
            this.err &&
              (this.err.properValue
                ? this.digest(this.err.node, this.err.properValue, !0)
                : this.err.node &&
                  (this.err.node.unset(),
                  this.digest(null, this.tp.getText())));
          }),
          (t.prototype.digest = function (e, t, n) {
            var r,
              i = 10;
            for (this.inDigest = !0; i--; ) {
              this.err = null;
              try {
                e ? e.parse(t) : this.tp.parse(t);
              } catch (o) {
                if (
                  (this.emit("digest", o), this.sel.get(), "NOT_INIT" == o.code)
                )
                  break;
                if (
                  ((this.err = o),
                  !n &&
                    ("NUMBER_TOOSHORT" == o.code ||
                      "NUMBER_TOOSMALL" == o.code ||
                      "NUMBER_MISMATCH" == o.code ||
                      "SELECT_MISMATCH" == o.code ||
                      "LEADING_ZERO" == o.code))
                )
                  break;
                if ("SELECT_INCOMPLETE" == o.code) {
                  (e = o.node), (t = o.selected), (r = { end: "end" });
                  continue;
                }
                null != o.properValue
                  ? ((e = o.node), (t = o.properValue))
                  : null != o.properText
                  ? ((e = null), (t = o.properText))
                  : ("EMPTY" == o.code && this.tp.unset(),
                    o.node && o.node.unset(),
                    (e = null),
                    (t = this.tp.getText()),
                    (r = { start: 0, end: "end" }));
                continue;
              }
              break;
            }
            if (
              (this.err ||
                (this.val(this.tp.getText()), i < 9 && this.sel.select(r)),
              (this.inDigest = !1),
              i < 0)
            )
              throw new Error(
                "InputMask.digest crashed! Infinite loop on " + t
              );
          }),
          t
        );
      })(M),
    },
    S = { TextParser: V.TextParser, InputMask: L.InputMask, utils: y },
    N = S.TextParser,
    A = y.num2str;
  e.module("datetime").factory("datetime", m),
    (m.$inject = ["$locale", "datetimePlaceholder"]);
  var O = S.InputMask;
  e.module("datetime").directive("datetime", g),
    (g.$inject = ["datetime", "$log", "$document"]);
})(angular);
1;

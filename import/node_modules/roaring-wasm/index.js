var cb,
  mod,
  __create = Object.create,
  __defProp = Object.defineProperty,
  __getOwnPropDesc = Object.getOwnPropertyDescriptor,
  __getOwnPropNames = Object.getOwnPropertyNames,
  __getProtoOf = Object.getPrototypeOf,
  __hasOwnProp = {}.hasOwnProperty,
  __require = /* @__PURE__ */ ((x) =>
    "u" > typeof require
      ? require
      : "u" > typeof Proxy
        ? new Proxy(x, {
            get(a, b) {
              return ("u" > typeof require ? require : a)[b];
            },
          })
        : x)(function (x) {
    if ("u" > typeof require) return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  }),
  require_roaring_wasm_module =
    ((cb = {
      "packages/roaring-wasm-src/lib/roaring-wasm-module/index.js"(
        exports,
        module,
      ) {
        "object" == typeof exports &&
          Object.defineProperty(exports, "__esModule", {
            value: !0,
          });
        var _scriptName,
          roaring_wasm =
            ((_scriptName =
              "u" > typeof document ? document.currentScript?.src : void 0),
            "u" > typeof __filename &&
              (_scriptName = _scriptName || __filename),
            function (moduleArg = {}) {
              var readyPromiseResolve,
                readyPromiseReject,
                Module = moduleArg;
              new Promise((resolve, reject) => {
                (readyPromiseResolve = resolve), (readyPromiseReject = reject);
              });
              var quit_,
                readBinary,
                scriptDirectory,
                moduleOverrides = Object.assign({}, Module),
                fs = __require("fs"),
                nodePath = __require("path");
              (scriptDirectory = __dirname + "/"),
                (readBinary = (filename) => {
                  filename = isFileURI(filename)
                    ? new URL(filename)
                    : nodePath.normalize(filename);
                  return fs.readFileSync(filename);
                }),
                !Module.thisProgram &&
                  process.argv.length > 1 &&
                  process.argv[1].replace(/\\/g, "/"),
                process.argv.slice(2),
                (quit_ = (status, toThrow) => {
                  throw ((process.exitCode = status), toThrow);
                });
              console.log.bind(console);
              var err = console.error.bind(console);
              Object.assign(Module, moduleOverrides), (moduleOverrides = null);
              var wasmMemory,
                EXITSTATUS,
                HEAPU8,
                ABORT = !1;
              function updateMemoryViews() {
                var b = wasmMemory.buffer;
                (Module.HEAP8 = new Int8Array(b)),
                  (Module.HEAP16 = new Int16Array(b)),
                  (Module.HEAPU8 = HEAPU8 = new Uint8Array(b)),
                  (Module.HEAPU16 = new Uint16Array(b)),
                  (Module.HEAP32 = new Int32Array(b)),
                  (Module.HEAPU32 = new Uint32Array(b)),
                  (Module.HEAPF32 = new Float32Array(b)),
                  (Module.HEAPF64 = new Float64Array(b));
              }
              var __ATPRERUN__ = [],
                __ATINIT__ = [],
                __ATPOSTRUN__ = [],
                runDependencies = 0,
                dependenciesFulfilled = null;
              function abort(what) {
                err((what = "Aborted(" + what + ")")),
                  (ABORT = !0),
                  (what += ". Build with -sASSERTIONS for more info.");
                var e = new WebAssembly.RuntimeError(what);
                throw (readyPromiseReject(e), e);
              }
              var wasmBinaryFile,
                isFileURI = (filename) => filename.startsWith("file://");
              function ExitStatus(status) {
                (this.name = "ExitStatus"),
                  (this.message = `Program terminated with exit(${status})`),
                  (this.status = status);
              }
              var callRuntimeCallbacks = (callbacks) => {
                  for (; callbacks.length > 0; ) callbacks.shift()(Module);
                },
                UTF8Decoder =
                  "u" > typeof TextDecoder ? new TextDecoder() : void 0,
                UTF8ToString = (ptr, maxBytesToRead) =>
                  ptr
                    ? ((heapOrArray, idx, maxBytesToRead) => {
                        for (
                          var endIdx = idx + maxBytesToRead, endPtr = idx;
                          heapOrArray[endPtr] && endIdx > endPtr;

                        )
                          ++endPtr;
                        if (
                          endPtr - idx > 16 &&
                          heapOrArray.buffer &&
                          UTF8Decoder
                        )
                          return UTF8Decoder.decode(
                            heapOrArray.subarray(idx, endPtr),
                          );
                        for (var str = ""; endPtr > idx; ) {
                          var u0 = heapOrArray[idx++];
                          if (128 & u0) {
                            var u1 = 63 & heapOrArray[idx++];
                            if (192 != (224 & u0)) {
                              var u2 = 63 & heapOrArray[idx++];
                              if (
                                65536 >
                                (u0 =
                                  224 == (240 & u0)
                                    ? ((15 & u0) << 12) | (u1 << 6) | u2
                                    : ((7 & u0) << 18) |
                                      (u1 << 12) |
                                      (u2 << 6) |
                                      (63 & heapOrArray[idx++]))
                              )
                                str += String.fromCharCode(u0);
                              else {
                                var ch = u0 - 65536;
                                str += String.fromCharCode(
                                  55296 | (ch >> 10),
                                  56320 | (1023 & ch),
                                );
                              }
                            } else
                              str += String.fromCharCode(((31 & u0) << 6) | u1);
                          } else str += String.fromCharCode(u0);
                        }
                        return str;
                      })(HEAPU8, ptr, maxBytesToRead)
                    : "",
                timers = {},
                handleException = (e) => {
                  if (e instanceof ExitStatus || "unwind" == e)
                    return EXITSTATUS;
                  quit_(1, e);
                },
                runtimeKeepaliveCounter = 0,
                keepRuntimeAlive = () => runtimeKeepaliveCounter > 0,
                _proc_exit = (code) => {
                  (EXITSTATUS = code),
                    keepRuntimeAlive() || (ABORT = !0),
                    quit_(code, new ExitStatus(code));
                },
                growMemory = (size) => {
                  var pages =
                    (size - wasmMemory.buffer.byteLength + 65535) / 65536;
                  try {
                    return wasmMemory.grow(pages), updateMemoryViews(), 1;
                  } catch {}
                },
                wasmImports = {
                  a(condition, filename, line, func) {
                    abort(
                      `Assertion failed: ${UTF8ToString(condition)}, at: ` +
                        [
                          filename
                            ? UTF8ToString(filename)
                            : "unknown filename",
                          line,
                          func ? UTF8ToString(func) : "unknown function",
                        ],
                    );
                  },
                  d() {
                    abort("");
                  },
                  f(dest, src, num) {
                    return HEAPU8.copyWithin(dest, src, src + num);
                  },
                  c() {
                    runtimeKeepaliveCounter = 0;
                  },
                  e(which, timeout_ms) {
                    if (
                      (timers[which] &&
                        (clearTimeout(timers[which].id), delete timers[which]),
                      !timeout_ms)
                    )
                      return 0;
                    var id = setTimeout(() => {
                      delete timers[which],
                        (() => {
                          if (!ABORT)
                            try {
                              __emscripten_timeout(which, performance.now()),
                                (() => {
                                  if (!keepRuntimeAlive())
                                    try {
                                      (EXITSTATUS = status = EXITSTATUS),
                                        _proc_exit(status);
                                    } catch (e) {
                                      handleException(e);
                                    }
                                  var status;
                                })();
                            } catch (e) {
                              handleException(e);
                            }
                        })();
                    }, timeout_ms);
                    return (
                      (timers[which] = {
                        id,
                        timeout_ms,
                      }),
                      0
                    );
                  },
                  g(requestedSize) {
                    var oldSize = HEAPU8.length;
                    if ((requestedSize >>>= 0) > 2147483648) return !1;
                    for (var cutDown = 1; 4 >= cutDown; cutDown *= 2) {
                      var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown),
                        newSize = Math.min(
                          2147483648,
                          65536 *
                            Math.ceil(
                              Math.max(
                                requestedSize,
                                (overGrownHeapSize = Math.min(
                                  overGrownHeapSize,
                                  requestedSize + 100663296,
                                )),
                              ) / 65536,
                            ),
                        );
                      if (growMemory(newSize)) return !0;
                    }
                    return !1;
                  },
                  b: _proc_exit,
                },
                wasmExports = (function createWasm() {
                  var info = (function getWasmImports() {
                    return {
                      a: wasmImports,
                    };
                  })();
                  (function addRunDependency() {
                    runDependencies++;
                  })(),
                    (wasmBinaryFile ??= (function findWasmBinary() {
                      return (function locateFile(path) {
                        return scriptDirectory + path;
                      })("index.wasm");
                    })());
                  return (function receiveInstance(instance) {
                    return (
                      (wasmMemory = (wasmExports = instance.exports).h),
                      updateMemoryViews(),
                      (function removeRunDependency() {
                        if (0 == --runDependencies && dependenciesFulfilled) {
                          var callback = dependenciesFulfilled;
                          (dependenciesFulfilled = null), callback();
                        }
                      })(),
                      wasmExports
                    );
                  })(
                    (function instantiateSync(file, info) {
                      var module2,
                        binary = (function getBinarySync(file) {
                          if (readBinary) return readBinary(file);
                          throw 'sync fetching of the wasm failed: you can preload it to Module["wasmBinary"] manually, or emcc.py will do that for you when generating HTML (but not JS)';
                        })(file);
                      module2 = new WebAssembly.Module(binary);
                      return [new WebAssembly.Instance(module2, info), module2];
                    })(wasmBinaryFile, info)[0],
                  );
                })();
              Module._jsalloc_zero = wasmExports.i;
              Module._jsalloc_unsafe = wasmExports.j;
              Module._roaring_bitmap_create_js = wasmExports.k;
              Module._roaring_bitmap_create_with_capacity = wasmExports.l;
              Module._roaring_bitmap_get_cardinality_js = wasmExports.m;
              Module._roaring_bitmap_optimize_js = wasmExports.n;
              Module._roaring_bitmap_run_optimize = wasmExports.o;
              Module._roaring_bitmap_select_js = wasmExports.p;
              Module._roaring_bitmap_get_index_js = wasmExports.q;
              Module._roaring_bitmap_at_js = wasmExports.r;
              Module._roaring_bitmap_contains_range_js = wasmExports.s;
              Module._roaring_bitmap_range_cardinality_js = wasmExports.t;
              Module._roaring_bitmap_from_range_js = wasmExports.u;
              Module._roaring_bitmap_add_range_js = wasmExports.v;
              Module._roaring_bitmap_remove_range_js = wasmExports.w;
              Module._roaring_bitmap_flip_range_inplace_js = wasmExports.x;
              Module._roaring_bitmap_flip_range_static_js = wasmExports.y;
              Module._roaring_bitmap_intersect_with_range_js = wasmExports.z;
              Module._roaring_bitmap_add_offset_js = wasmExports.A;
              Module._roaring_bitmap_copy = wasmExports.B;
              Module._roaring_bitmap_shrink_to_fit_js = wasmExports.C;
              Module._roaring_bitmap_jaccard_index_js = wasmExports.D;
              Module._roaring_bitmap_and_cardinality = wasmExports.E;
              Module._roaring_bitmap_and_js = wasmExports.F;
              Module._roaring_bitmap_or_js = wasmExports.G;
              Module._roaring_bitmap_xor_js = wasmExports.H;
              Module._roaring_bitmap_andnot_js = wasmExports.I;
              Module._roaring_iterator_js_new = wasmExports.J;
              Module._free = wasmExports.K;
              Module._roaring_iterator_js_clone = wasmExports.L;
              Module._roaring_iterator_js_next = wasmExports.M;
              Module._roaring_iterator_js_gte = wasmExports.N;
              Module._roaring_sync_iter_init = wasmExports.O;
              Module._roaring_sync_iter_next = wasmExports.P;
              Module._roaring_sync_iter_min = wasmExports.Q;
              Module._roaring_sync_bulk_add_init = wasmExports.R;
              Module._roaring_sync_bulk_add_chunk = wasmExports.S;
              Module._roaring_sync_bulk_remove_init = wasmExports.T;
              Module._roaring_sync_bulk_remove_chunk = wasmExports.U;
              Module._roaring_bitmap_remove_many = wasmExports.V;
              Module._roaring_bitmap_has_js = wasmExports.W;
              Module._roaring_bitmap_add_many = wasmExports.X;
              Module._roaring_bitmap_add = wasmExports.Y;
              Module._roaring_bitmap_minimum = wasmExports.Z;
              Module._roaring_bitmap_maximum = wasmExports._;
              Module._roaring_bitmap_free = wasmExports.$;
              Module._roaring_bitmap_overwrite = wasmExports.aa;
              Module._roaring_bitmap_add_checked = wasmExports.ba;
              Module._roaring_bitmap_remove = wasmExports.ca;
              Module._roaring_bitmap_remove_checked = wasmExports.da;
              Module._roaring_bitmap_or_many = wasmExports.ea;
              Module._roaring_bitmap_xor_many = wasmExports.fa;
              Module._roaring_bitmap_and_inplace = wasmExports.ga;
              Module._roaring_bitmap_or_inplace = wasmExports.ha;
              Module._roaring_bitmap_xor_inplace = wasmExports.ia;
              Module._roaring_bitmap_andnot_inplace = wasmExports.ja;
              Module._roaring_bitmap_is_empty = wasmExports.ka;
              Module._roaring_bitmap_to_uint32_array = wasmExports.la;
              Module._roaring_bitmap_remove_run_compression = wasmExports.ma;
              Module._roaring_bitmap_serialize = wasmExports.na;
              Module._roaring_bitmap_portable_size_in_bytes = wasmExports.oa;
              Module._roaring_bitmap_portable_serialize = wasmExports.pa;
              Module._roaring_bitmap_size_in_bytes = wasmExports.qa;
              Module._roaring_bitmap_portable_deserialize_safe = wasmExports.ra;
              Module._roaring_bitmap_deserialize_safe = wasmExports.sa;
              Module._roaring_bitmap_equals = wasmExports.ta;
              Module._roaring_bitmap_is_subset = wasmExports.ua;
              Module._roaring_bitmap_rank = wasmExports.va;
              Module._roaring_bitmap_intersect = wasmExports.wa;
              Module._roaring_bitmap_or_cardinality = wasmExports.xa;
              Module._roaring_bitmap_andnot_cardinality = wasmExports.ya;
              Module._roaring_bitmap_xor_cardinality = wasmExports.za;
              Module._roaring_bitmap_is_strict_subset = wasmExports.Aa;
              Module._roaring_bitmap_frozen_size_in_bytes = wasmExports.Ba;
              Module._roaring_bitmap_frozen_serialize = wasmExports.Ca;
              Module._roaring_bitmap_frozen_view = wasmExports.Da;
              Module._roaring_bitmap_portable_deserialize_frozen =
                wasmExports.Ea;
              var calledRun,
                __emscripten_timeout = wasmExports.Fa;
              dependenciesFulfilled = function runCaller() {
                calledRun || run(),
                  calledRun || (dependenciesFulfilled = runCaller);
              };
              function run() {
                runDependencies > 0 ||
                  ((function preRun() {
                    callRuntimeCallbacks(__ATPRERUN__);
                  })(),
                  runDependencies > 0) ||
                  (function doRun() {
                    calledRun ||
                      ((calledRun = !0),
                      (Module.calledRun = !0),
                      !ABORT &&
                        ((function initRuntime() {
                          callRuntimeCallbacks(__ATINIT__);
                        })(),
                        readyPromiseResolve(Module),
                        (function postRun() {
                          callRuntimeCallbacks(__ATPOSTRUN__);
                        })()));
                  })();
              }
              return run(), Module;
            });
        "object" == typeof exports && "object" == typeof module
          ? (module.exports = roaring_wasm)
          : "function" == typeof define &&
            define.amd &&
            define([], () => roaring_wasm);
        "object" == typeof exports && (exports.default = roaring_wasm);
      },
    }),
    () => (
      mod ||
        (0, cb[__getOwnPropNames(cb)[0]])(
          (mod = {
            exports: {},
          }).exports,
          mod,
        ),
      mod.exports
    )),
  SerializationFormat = /* @__PURE__ */ ((SerializationFormat2) => (
    (SerializationFormat2.croaring = "croaring"),
    (SerializationFormat2.portable = "portable"),
    (SerializationFormat2.unsafe_frozen_croaring = "unsafe_frozen_croaring"),
    (SerializationFormat2.uint32_array = "uint32_array"),
    SerializationFormat2
  ))(SerializationFormat || {}),
  DeserializationFormat = /* @__PURE__ */ ((DeserializationFormat2) => (
    (DeserializationFormat2.croaring = "croaring"),
    (DeserializationFormat2.portable = "portable"),
    (DeserializationFormat2.unsafe_frozen_croaring = "unsafe_frozen_croaring"),
    (DeserializationFormat2.unsafe_frozen_portable = "unsafe_frozen_portable"),
    (DeserializationFormat2.uint32_array = "uint32_array"),
    DeserializationFormat2
  ))(DeserializationFormat || {}),
  isDisposable = (value) =>
    "object" == typeof value &&
    null !== value &&
    "function" == typeof value.dispose,
  dispose = (disposable) => {
    let ret =
      !!disposable &&
      "function" == typeof disposable.dispose &&
      disposable.dispose();
    return void 0 === ret || !0 === ret;
  };

function disposeThis() {
  let ret = !!this && "function" == typeof this.dispose && this.dispose();
  return void 0 === ret || !0 === ret;
}

var _initializePromise,
  roaringWasm,
  tryDispose = (disposable) => {
    if (disposable)
      try {
        let ret =
          "function" == typeof disposable.dispose && disposable.dispose();
        return void 0 === ret || ret;
      } catch {}
    return !1;
  },
  disposeAll = (...disposables) => {
    let errorToThrow,
      result = 0;
    for (let disposable of disposables) {
      try {
        isDisposable(disposable) && dispose(disposable) && ++result;
      } catch (e) {
        errorToThrow = e;
      }
      Array.isArray(disposable) && disposeAll(...disposable);
    }
    if (void 0 !== errorToThrow) throw errorToThrow;
    return result;
  },
  import_roaring_wasm_module = ((mod, isNodeMode, target) => (
    (target = null != mod ? __create(__getProtoOf(mod)) : {}),
    ((to, from, except, desc) => {
      if ((from && "object" == typeof from) || "function" == typeof from)
        for (let key of __getOwnPropNames(from))
          !__hasOwnProp.call(to, key) &&
            void 0 !== key &&
            __defProp(to, key, {
              get: () => from[key],
              enumerable:
                !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
            });
      return to;
    })(
      mod && mod.__esModule
        ? target
        : __defProp(target, "default", {
            value: mod,
            enumerable: !0,
          }),
      mod,
    )
  ))(require_roaring_wasm_module()),
  _loadedModule = (0, import_roaring_wasm_module.default)();

"function" == typeof _loadedModule.then
  ? (_initializePromise = _loadedModule.then((m) => {
      roaringWasm = m;
    }))
  : ((roaringWasm = _loadedModule), (_initializePromise = Promise.resolve()));

var _free_finalizationRegistry,
  _finalizationRegistry,
  _free_finalizationRegistry_init =
    "u" > typeof FinalizationRegistry
      ? () =>
          (_free_finalizationRegistry = new FinalizationRegistry(
            roaringWasm._free,
          ))
      : () => {},
  _roaringArenaAllocator_head = null,
  _stack = null,
  RoaringUint8Array = class {
    #p;
    #size;
    #alloc;
    get byteLength() {
      return this.#size;
    }
    get isDisposed() {
      return !this.#p;
    }
    constructor(
      lengthOrArray = 0,
      arenaAllocator = _roaringArenaAllocator_head,
    ) {
      if (
        ((this.#p = 0),
        (this.#size = 0),
        (this.#alloc = arenaAllocator),
        lengthOrArray)
      ) {
        let length;
        if ("number" == typeof lengthOrArray) length = Math.ceil(lengthOrArray);
        else {
          if (null === lengthOrArray || "object" != typeof lengthOrArray)
            throw new TypeError("Invalid argument");
          if (((length = lengthOrArray.length), "number" != typeof length)) {
            let copy = new Uint8Array(lengthOrArray);
            (lengthOrArray = copy), (length = copy.length);
          }
        }
        if (length > 0) {
          if (((length = Math.ceil(length)), length >= 268435456))
            throw new RangeError(`RoaringUint8Array too big, ${length} bytes`);
          let pointer = roaringWasm._jsalloc_zero(length) >>> 0;
          if (!pointer)
            throw Error(`RoaringUint8Array failed to allocate ${length} bytes`);
          (this.#p = pointer), (this.#size = length);
          let finalizationRegistry =
            _free_finalizationRegistry || _free_finalizationRegistry_init();
          if (
            (finalizationRegistry &&
              finalizationRegistry.register(this, pointer, this),
            arenaAllocator && arenaAllocator.register(this),
            "number" != typeof lengthOrArray)
          )
            try {
              this.set(lengthOrArray);
            } catch (error) {
              throw (this.dispose(), error);
            }
        }
      }
    }
    throwIfDisposed() {
      if (this.isDisposed) throw new TypeError("RoaringUint8Array is disposed");
    }
    dispose() {
      let ptr = this.#p;
      if (ptr) {
        (this.#p = 0), (this.#size = 0);
        let allocator = this.#alloc;
        return (
          allocator && ((this.#alloc = null), allocator.unregister(this)),
          _free_finalizationRegistry &&
            _free_finalizationRegistry.unregister(this),
          roaringWasm._free(ptr),
          !0
        );
      }
      return !1;
    }
    shrink(newLength) {
      return (
        !Number.isNaN(newLength) &&
        (1 > newLength
          ? this.dispose()
          : newLength < this.#size && ((this.#size = newLength >>> 0), !0))
      );
    }
    set(array, offset = 0) {
      if (array.length) this.asTypedArray().set(array, offset);
      else {
        let typedArray;
        for (let value of array)
          (typedArray || (typedArray = this.asTypedArray()))[offset++] = value;
      }
      return this;
    }
    asTypedArray() {
      let ptr = this.#p;
      return roaringWasm.HEAPU8.subarray(ptr, ptr + this.#size);
    }
    toTypedArray(output) {
      let ptr = this.#p,
        size = this.#size;
      if (!output) return roaringWasm.HEAPU8.slice(ptr, ptr + size);
      let outlen = output.length;
      return (
        outlen > size && ((outlen = size), (output = output.subarray(0, size))),
        output.set(roaringWasm.HEAPU8.subarray(ptr, ptr + outlen)),
        output
      );
    }
    toString() {
      return "" + this.asTypedArray();
    }
    at(index) {
      let ptr = this.#p,
        length = this.#size;
      return (
        0 > index && (index += length),
        ptr && index >= 0 && length > index
          ? roaringWasm.HEAPU8[(ptr + index) >>> 0]
          : void 0
      );
    }
    setAt(index, value) {
      let ptr = this.#p,
        length = this.#size;
      return (
        0 > index && (index += length),
        !(
          !ptr ||
          0 > index ||
          index >= length ||
          ((roaringWasm.HEAPU8[(ptr + index) >>> 0] = value), 0)
        )
      );
    }
    get _p() {
      return this.#p;
    }
  },
  RoaringBitmap32Iterator = class _RoaringBitmap32Iterator {
    #bmp;
    #p;
    #r;
    #alloc;
    constructor(bitmap = null, arenaAllocator = _roaringArenaAllocator_head) {
      (this.#bmp = bitmap),
        (this.#p = 0),
        (this.#r = {
          done: !0,
          value: void 0,
        }),
        (this.#alloc = arenaAllocator);
    }
    get isDisposed() {
      return !1 === this.#p;
    }
    get value() {
      return this.#r.value;
    }
    get done() {
      return !1 === this.#p;
    }
    return(_value) {
      return this.dispose(), this.#r;
    }
    throw(e) {
      throw (this.dispose(), e);
    }
    [Symbol.iterator]() {
      return this;
    }
    clone(allocator) {
      let thisPtr = this.#p,
        result = new _RoaringBitmap32Iterator(this.#bmp, allocator);
      return (
        (result.#p =
          thisPtr && roaringWasm._roaring_iterator_js_clone(thisPtr)),
        result.#p && result.#init(),
        result
      );
    }
    next() {
      let r = this.#r,
        p = this.#p,
        bitmap = this.#bmp;
      if (!p && ((p = this.#init()), !p)) return r;
      let value = roaringWasm._roaring_iterator_js_next(p, bitmap._p, bitmap.v);
      return 0 > value ? this.#end() : (r.value = value), r;
    }
    reset() {
      let r = this.#r,
        ptr = this.#p;
      return (
        ptr &&
          (_free_finalizationRegistry &&
            _free_finalizationRegistry.unregister(this),
          roaringWasm._free(ptr)),
        (this.#p = 0),
        (r.done = !1),
        (r.value = void 0),
        this
      );
    }
    moveToGreaterEqual(minimumValue) {
      let p = this.#p;
      if (!p && ((p = this.#init()), !p)) return this;
      let bitmap = this.#bmp,
        v = roaringWasm._roaring_iterator_js_gte(
          p,
          bitmap._p,
          bitmap.v,
          minimumValue,
        );
      if (0 > v) this.#end();
      else {
        this.#p = p;
        let r = this.#r;
        (r.value = v), (r.done = !1);
      }
      return this;
    }
    dispose() {
      let ptr = this.#p;
      if (ptr) roaringWasm._free(ptr);
      else if (!1 === ptr) return !1;
      return this.#end(), !0;
    }
    #init() {
      let r = this.#r,
        bitmap = this.#bmp,
        ptr =
          !1 !== this.#p &&
          !!bitmap &&
          (roaringWasm._roaring_iterator_js_new(bitmap._p, bitmap.v) || !1);
      if (ptr) {
        let allocator = this.#alloc;
        allocator && allocator.register(this);
        let finalizationRegistry =
          _free_finalizationRegistry || _free_finalizationRegistry_init();
        finalizationRegistry &&
          finalizationRegistry.register(this, this.#p, this),
          (r.done = !1);
      } else (r.value = void 0), (r.done = !0);
      return (this.#p = ptr), ptr;
    }
    #end() {
      let r = this.#r,
        alloc = this.#alloc;
      return (
        alloc && alloc.unregister(this),
        _free_finalizationRegistry &&
          this.#p &&
          _free_finalizationRegistry.unregister(this),
        (this.#p = !1),
        (r.done = !0),
        (r.value = void 0),
        r
      );
    }
  },
  isView = ArrayBuffer.isView,
  _throwFrozen = () => {
    throw new TypeError("RoaringBitmap32 is frozen");
  },
  RoaringBitmap32 = class _RoaringBitmap32 {
    #p;
    #v;
    #size;
    #frozen;
    #alloc;
    static from(values) {
      return new _RoaringBitmap32(values);
    }
    static of(...values) {
      return new _RoaringBitmap32(values);
    }
    static fromRange(rangeStart = 0, rangeEnd = 4294967296, step = 1) {
      let bitmap = new _RoaringBitmap32();
      return (
        bitmap.#setPtr(
          roaringWasm._roaring_bitmap_from_range_js(rangeStart, rangeEnd, step),
        ),
        bitmap
      );
    }
    static addOffset(input, offset) {
      let result = new _RoaringBitmap32();
      return (
        result.#setPtr(
          roaringWasm._roaring_bitmap_add_offset_js(input.#p, offset),
        ),
        result
      );
    }
    static flipRange(input, rangeStart, rangeEnd) {
      let result = new _RoaringBitmap32();
      return (
        result.#setPtr(
          roaringWasm._roaring_bitmap_flip_range_static_js(
            input.#p,
            rangeStart,
            rangeEnd,
          ),
        ),
        result
      );
    }
    static deserialize(a, b) {
      let result = new _RoaringBitmap32();
      return result.deserialize(a, b), result;
    }
    deserialize(a, b) {
      this.#frozen && _throwFrozen();
      let buffer,
        format,
        thisptr = this.#p;
      thisptr ? this.#setPtr(0) : !1 === thisptr && this.throwIfDisposed();
      if (
        ("string" == typeof a || "boolean" == typeof a
          ? ((format = a), (buffer = b))
          : ((format = b), (buffer = a)),
        !buffer.byteLength)
      )
        return this;
      if (!(buffer instanceof RoaringUint8Array)) {
        if ("uint32_array" === format) {
          let size = buffer.byteLength;
          if (size % 4 != 0)
            throw Error("RoaringBitmap32 deserialization failed");
          return (
            this.addMany(
              new Uint32Array(buffer.buffer, buffer.byteOffset, size / 4),
            ),
            this
          );
        }
        let roaringArray = new RoaringUint8Array(buffer);
        try {
          return this.deserialize(roaringArray, format);
        } finally {
          roaringArray.dispose();
        }
      }
      let ptr = 0;
      switch (format) {
        case !1:
        case "croaring":
          ptr = roaringWasm._roaring_bitmap_deserialize_safe(
            buffer._p,
            buffer.byteLength,
          );
          break;

        case !0:
        case "portable":
          ptr = roaringWasm._roaring_bitmap_portable_deserialize_safe(
            buffer._p,
            buffer.byteLength,
          );
          break;

        case "unsafe_frozen_croaring": {
          let frozen = roaringWasm._roaring_bitmap_frozen_view(
            buffer._p,
            buffer.byteLength,
          );
          if (frozen)
            try {
              ptr = roaringWasm._roaring_bitmap_copy(frozen);
            } finally {
              roaringWasm._roaring_bitmap_free(frozen);
            }
          break;
        }

        case "unsafe_frozen_portable":
          ptr = roaringWasm._roaring_bitmap_portable_deserialize_frozen(
            buffer._p,
            buffer.byteLength,
          );
          break;

        case "uint32_array":
          if (buffer.byteLength % 4 == 0)
            return (
              (ptr = this.#p || this.#createEmpty()),
              roaringWasm._roaring_bitmap_add_many(
                ptr,
                buffer.byteLength / 4,
                buffer._p,
              ),
              this
            );
      }
      if (!ptr) throw Error("RoaringBitmap32 deserialization failed");
      return this.#setPtr(ptr), this;
    }
    getSerializationSizeInBytes(format) {
      let ptr = this.#p || this.#createEmpty();
      switch (format) {
        case !1:
        case "croaring":
          return roaringWasm._roaring_bitmap_size_in_bytes(ptr) >>> 0;

        case !0:
        case "portable":
          return roaringWasm._roaring_bitmap_portable_size_in_bytes(ptr) >>> 0;

        case "unsafe_frozen_croaring":
          return roaringWasm._roaring_bitmap_frozen_size_in_bytes(ptr) >>> 0;

        case "uint32_array":
          return 4 * this.size;

        default:
          throw new TypeError("Invalid serialization format: " + format);
      }
    }
    serialize(a, b) {
      let format, output, outputAllocated;
      b && "string" != typeof a && "boolean" != typeof a
        ? ((format = b), (output = a))
        : ((format = a), (output = b));
      try {
        if ("uint32_array" === format) {
          let uint32Array;
          if (output) {
            if (output === RoaringUint8Array)
              (outputAllocated = new RoaringUint8Array(4 * this.size)),
                (output = outputAllocated);
            else if (output.byteLength % 4 != 0)
              throw new TypeError(
                "Invalid output buffer size: " + output.byteLength,
              );
            if (output instanceof RoaringUint8Array) {
              if (output.byteLength !== 4 * this.size)
                throw new TypeError(
                  `Invalid output buffer size: ${output.byteLength}, must be ${4 * this.size}}`,
                );
              let p = this.#p,
                outp2 = output._p;
              return (
                p &&
                  outp2 &&
                  roaringWasm._roaring_bitmap_to_uint32_array(p, outp2),
                output
              );
            }
            uint32Array = this.toUint32Array(
              new Uint32Array(
                output.buffer,
                output.byteOffset,
                output.byteLength / 4,
              ),
            );
          } else uint32Array = this.toUint32Array();
          return new Uint8Array(
            uint32Array.buffer,
            uint32Array.byteOffset,
            uint32Array.byteLength,
          );
        }
        let ptr = this.#p || this.#createEmpty(),
          size = this.getSerializationSizeInBytes(format);
        output === RoaringUint8Array &&
          ((outputAllocated = new RoaringUint8Array(size)),
          (output = outputAllocated));
        let outp = 0,
          ownsOutp = !1;
        if (output instanceof RoaringUint8Array) {
          if (output.byteLength !== size)
            throw new TypeError(
              `Invalid output buffer size: ${output.byteLength}, must be ${size}}`,
            );
          outp = output._p;
        }
        if (!outp) {
          if (((outp = roaringWasm._jsalloc_unsafe(size) >>> 0), !outp))
            throw Error("Allocation failed");
          ownsOutp = !0;
        }
        try {
          switch (format) {
            case !1:
            case "croaring":
              roaringWasm._roaring_bitmap_serialize(ptr, outp);
              break;

            case !0:
            case "portable":
              roaringWasm._roaring_bitmap_portable_serialize(ptr, outp);
              break;

            case "unsafe_frozen_croaring":
              roaringWasm._roaring_bitmap_frozen_serialize(ptr, outp);
          }
          return output
            ? output instanceof RoaringUint8Array
              ? output
              : (output.set(roaringWasm.HEAPU8.subarray(outp, outp + size)),
                output.length === size ? output : output.subarray(0, size))
            : roaringWasm.HEAPU8.slice(outp, outp + size);
        } finally {
          ownsOutp && roaringWasm._free(outp);
        }
      } catch (e) {
        throw (outputAllocated && outputAllocated.dispose(), e);
      }
    }
    serializeToRoaringUint8Array(format, output) {
      return this.serialize(format, output || RoaringUint8Array);
    }
    freeze() {
      return this.#frozen || (this.#frozen = 1), this;
    }
    constructor(
      valuesOrCapacity,
      arenaAllocator = _roaringArenaAllocator_head,
    ) {
      if (
        ((this.#p = 0),
        (this.#size = 0),
        (this.#v = 1),
        (this.#frozen = 0),
        (this.#alloc = arenaAllocator),
        arenaAllocator && arenaAllocator.register(this),
        valuesOrCapacity)
      )
        if ("number" == typeof valuesOrCapacity)
          valuesOrCapacity >= 1 &&
            4294967296 > valuesOrCapacity &&
            this.#setPtr(
              roaringWasm._roaring_bitmap_create_with_capacity(
                valuesOrCapacity >>> 0,
              ),
            );
        else
          try {
            this.addMany(valuesOrCapacity);
          } catch (error) {
            throw (this.dispose(), error);
          }
    }
    get v() {
      return this.#v;
    }
    get isDisposed() {
      return !1 === this.#p;
    }
    get isFrozen() {
      return !!this.#frozen;
    }
    get size() {
      let size = this.#size;
      return (
        0 > size &&
          ((size = roaringWasm._roaring_bitmap_get_cardinality_js(this.#p)),
          (this.#size = size)),
        size
      );
    }
    get isEmpty() {
      if (0 === this.#size) return !0;
      let ptr = this.#p;
      return !(
        (ptr && !roaringWasm._roaring_bitmap_is_empty(ptr)) ||
        ((this.#size = 0), 0)
      );
    }
    [Symbol.iterator]() {
      return new RoaringBitmap32Iterator(this);
    }
    dispose() {
      if (!1 === this.#p) return !1;
      this.#setPtr(!1);
      let allocator = this.#alloc;
      return (
        allocator && ((this.#alloc = null), allocator.unregister(this)), !0
      );
    }
    throwIfDisposed() {
      if (!1 === this.#p) throw new TypeError("RoaringBitmap32 was disposed");
    }
    clear() {
      this.#frozen && _throwFrozen(), this.#setPtr(0);
    }
    clone() {
      let result = new _RoaringBitmap32(),
        ptr = this.#p;
      return (
        ptr && result.#setPtr(roaringWasm._roaring_bitmap_copy(ptr)), result
      );
    }
    hasRange(rangeStart = 0, rangeEnd = 4294967296) {
      return !!roaringWasm._roaring_bitmap_contains_range_js(
        this.#p,
        rangeStart,
        rangeEnd,
      );
    }
    rangeCardinality(rangeStart = 0, rangeEnd = 4294967296) {
      return roaringWasm._roaring_bitmap_range_cardinality_js(
        this.#p,
        rangeStart,
        rangeEnd,
      );
    }
    addRange(rangeStart = 0, rangeEnd = 4294967296) {
      let ptr = this.#p;
      return (
        this.#frozen && _throwFrozen(),
        ptr
          ? roaringWasm._roaring_bitmap_add_range_js(
              ptr,
              rangeStart,
              rangeEnd,
            ) && this.invalidate()
          : this.#setPtr(
              roaringWasm._roaring_bitmap_from_range_js(
                rangeStart,
                rangeEnd,
                1,
              ),
            ),
        this
      );
    }
    removeRange(rangeStart = 0, rangeEnd = 4294967296) {
      return (
        this.#frozen && _throwFrozen(),
        roaringWasm._roaring_bitmap_remove_range_js(
          this.#p,
          rangeStart,
          rangeEnd,
        ) && this.invalidate(),
        this
      );
    }
    flipRange(rangeStart = 0, rangeEnd = 4294967296) {
      this.#frozen && _throwFrozen();
      let ptr = this.#p;
      return (
        ptr
          ? roaringWasm._roaring_bitmap_flip_range_inplace_js(
              ptr,
              rangeStart,
              rangeEnd,
            ) && this.invalidate()
          : this.#setPtr(
              roaringWasm._roaring_bitmap_from_range_js(
                rangeStart,
                rangeEnd,
                1,
              ),
            ),
        this
      );
    }
    overwrite(other) {
      if ((this.#frozen && _throwFrozen(), this !== other)) {
        let otherPtr = other.#p;
        if (otherPtr) {
          let thisPtr = this.#p;
          thisPtr
            ? (roaringWasm._roaring_bitmap_overwrite(thisPtr, otherPtr),
              this.invalidate())
            : this.#setPtr(roaringWasm._roaring_bitmap_copy(otherPtr)),
            (this.#size = other.#size);
        } else this.clear();
      }
      return this;
    }
    add(value) {
      return (
        this.#frozen && _throwFrozen(),
        roaringWasm._roaring_bitmap_add_checked(
          this.#p || this.#createEmpty(),
          value,
        ) && this.invalidate(),
        this
      );
    }
    tryAdd(value) {
      return (
        this.#frozen && _throwFrozen(),
        !!roaringWasm._roaring_bitmap_add_checked(
          this.#p || this.#createEmpty(),
          value,
        ) && (this.invalidate(), !0)
      );
    }
    addMany(values) {
      return (
        this.#frozen && _throwFrozen(),
        values &&
          (values instanceof _RoaringBitmap32
            ? this.orInPlace(values)
            : isView(values) && values.BYTES_PER_ELEMENT > 0
              ? this.#addTypedArray(values)
              : this.#addIterable(values)),
        this
      );
    }
    removeMany(values) {
      return (
        this.#frozen && _throwFrozen(),
        this.#p &&
          values &&
          (values instanceof _RoaringBitmap32
            ? this.andNotInPlace(values)
            : isView(values) && values.BYTES_PER_ELEMENT > 0
              ? this.#removeTypedArray(values)
              : this.#removeIterable(values)),
        this
      );
    }
    delete(value) {
      this.#frozen && _throwFrozen();
      let ptr = this.#p;
      return !(
        !ptr ||
        !roaringWasm._roaring_bitmap_remove_checked(ptr, value) ||
        (this.invalidate(), 0)
      );
    }
    pop() {
      this.#frozen && _throwFrozen();
      let ptr = this.#p;
      if (ptr) {
        let value = roaringWasm._roaring_bitmap_maximum(ptr);
        if (roaringWasm._roaring_bitmap_remove_checked(ptr, value))
          return this.invalidate(), value;
      }
    }
    shift() {
      this.#frozen && _throwFrozen();
      let ptr = this.#p;
      if (ptr) {
        let value = roaringWasm._roaring_bitmap_minimum(ptr);
        if (roaringWasm._roaring_bitmap_remove_checked(ptr, value))
          return this.invalidate(), value;
      }
    }
    minimum() {
      let ptr = this.#p;
      return ptr ? roaringWasm._roaring_bitmap_minimum(ptr) >>> 0 : 4294967295;
    }
    maximum() {
      let ptr = this.#p;
      return ptr ? roaringWasm._roaring_bitmap_maximum(ptr) >>> 0 : 0;
    }
    has(value) {
      return !!roaringWasm._roaring_bitmap_has_js(this.#p, value);
    }
    isSubset(other) {
      let a = this.#p,
        b = other.#p;
      return !a || !(!b || !roaringWasm._roaring_bitmap_is_subset(a, b));
    }
    isStrictSubset(other) {
      let a = this.#p,
        b = other.#p;
      return !!(a && b && roaringWasm._roaring_bitmap_is_strict_subset(a, b));
    }
    toUint32Array(output = new Uint32Array(this.size)) {
      "number" == typeof output && (output = new Uint32Array(output));
      let { _roaring_sync_iter_next, HEAPU32 } = roaringWasm,
        mem = roaringWasm._roaring_sync_iter_init(this.#p, output.length) >>> 2;
      for (let written = 0; ; ) {
        let n = _roaring_sync_iter_next();
        if (983040 > n)
          return (
            n > 0 &&
              (output.set(HEAPU32.subarray(mem, mem + n), written),
              (written += n)),
            output.length > written ? output.subarray(0, written) : output
          );
        output.set(HEAPU32.subarray(mem, mem + n), written), (written += n);
      }
    }
    toArray(output = [], maxLength = 4294967296) {
      "number" == typeof output && ((maxLength = output), (output = []));
      let { _roaring_sync_iter_next, HEAPU32 } = roaringWasm,
        mem = roaringWasm._roaring_sync_iter_init(this.#p, maxLength) >>> 2;
      for (;;) {
        let n = _roaring_sync_iter_next();
        for (let i = 0; n > i; ++i) output.push(HEAPU32[mem + i]);
        if (983040 > n) return output;
      }
    }
    toSet(output = /* @__PURE__ */ new Set(), maxLength = 4294967296) {
      "number" == typeof output &&
        ((maxLength = output), (output = /* @__PURE__ */ new Set()));
      let { _roaring_sync_iter_next, HEAPU32 } = roaringWasm,
        mem = roaringWasm._roaring_sync_iter_init(this.#p, maxLength) >>> 2;
      for (;;) {
        let n = _roaring_sync_iter_next();
        for (let i = 0; n > i; ++i) output.add(HEAPU32[mem + i]);
        if (983040 > n) return output;
      }
    }
    join(sepatator = ",", maxStringLength = 536870888) {
      let mem =
          roaringWasm._roaring_sync_iter_init(
            this.#p,
            10 * (maxStringLength + sepatator.length),
          ) >>> 2,
        { _roaring_sync_iter_next, HEAPU32 } = roaringWasm,
        result = "",
        isFirst = !0;
      for (;;) {
        let n = _roaring_sync_iter_next();
        for (let i = 0; n > i; ++i) {
          let s;
          if (
            (isFirst
              ? ((isFirst = !1), (s = "" + HEAPU32[mem + i]))
              : (s = sepatator + HEAPU32[mem + i]),
            result.length + s.length > maxStringLength)
          )
            return result;
          result += s;
        }
        if (983040 > n) return result;
      }
    }
    rangeUint32Array(minimumValue = 0, maximumValue = 4294967296, output) {
      let range = roaringWasm._roaring_bitmap_range_cardinality_js(
        this.#p,
        minimumValue,
        maximumValue,
      );
      output
        ? range > output.length && (range = output.length)
        : (output = new Uint32Array(range));
      let written = 0;
      if (range > 0) {
        let { _roaring_sync_iter_next, HEAPU32 } = roaringWasm,
          mem = roaringWasm._roaring_sync_iter_init(this.#p, range) >>> 2;
        for (
          let n = roaringWasm._roaring_sync_iter_min(minimumValue);
          n > 0 &&
          (output.set(HEAPU32.subarray(mem, mem + n), written),
          (written += n),
          n >= 983040);

        )
          n = _roaring_sync_iter_next();
      }
      return output.length > written ? output.subarray(0, written) : output;
    }
    rangeArray(minimumValue = 0, maximumValue = 4294967296, output = []) {
      let range = roaringWasm._roaring_bitmap_range_cardinality_js(
        this.#p,
        minimumValue,
        maximumValue,
      );
      if (range > 0) {
        let { _roaring_sync_iter_next, HEAPU32 } = roaringWasm,
          mem = roaringWasm._roaring_sync_iter_init(this.#p, range) >>> 2;
        for (
          let n = roaringWasm._roaring_sync_iter_min(minimumValue);
          n > 0;

        ) {
          for (let i = 0; n > i; ++i) output.push(HEAPU32[mem + i]);
          if (983040 > n) break;
          n = _roaring_sync_iter_next();
        }
      }
      return output;
    }
    rangeSet(
      minimumValue = 0,
      maximumValue = 4294967296,
      output = /* @__PURE__ */ new Set(),
    ) {
      let range = roaringWasm._roaring_bitmap_range_cardinality_js(
        this.#p,
        minimumValue,
        maximumValue,
      );
      if (range > 0) {
        let { _roaring_sync_iter_next, HEAPU32 } = roaringWasm,
          mem = roaringWasm._roaring_sync_iter_init(this.#p, range) >>> 2;
        for (
          let n = roaringWasm._roaring_sync_iter_min(minimumValue);
          n > 0;

        ) {
          for (let i = 0; n > i; ++i) output.add(HEAPU32[mem + i]);
          if (983040 > n) break;
          n = _roaring_sync_iter_next();
        }
      }
      return output;
    }
    rangeJoin(minimumValue = 0, maximumValue = 4294967296, separator = ",") {
      let range = roaringWasm._roaring_bitmap_range_cardinality_js(
          this.#p,
          minimumValue,
          maximumValue,
        ),
        result = "";
      if (range > 0) {
        let { _roaring_sync_iter_next, HEAPU32 } = roaringWasm,
          mem = roaringWasm._roaring_sync_iter_init(this.#p, range) >>> 2,
          isFirst = !0;
        for (
          let n = roaringWasm._roaring_sync_iter_min(minimumValue);
          n > 0;

        ) {
          isFirst ? (isFirst = !1) : (result += separator),
            (result += HEAPU32[mem]);
          for (let i = 1; n > i; ++i) result += separator + HEAPU32[mem + i];
          if (983040 > n) break;
          n = _roaring_sync_iter_next();
        }
      }
      return result;
    }
    sliceUint32Array(start = 0, end = 4294967296, output) {
      let min = roaringWasm._roaring_bitmap_at_js(this.#p, start),
        max = roaringWasm._roaring_bitmap_at_js(this.#p, end);
      return (
        0 > max && (max = 4294967296),
        this.rangeUint32Array(0 > min ? max : min, max, output)
      );
    }
    sliceArray(start = 0, end = 4294967296, output) {
      let min = roaringWasm._roaring_bitmap_at_js(this.#p, start),
        max = roaringWasm._roaring_bitmap_at_js(this.#p, end);
      return (
        0 > max && (max = 4294967296),
        this.rangeArray(0 > min ? max : min, max, output)
      );
    }
    sliceSet(start = 0, end = 4294967296, output) {
      let min = roaringWasm._roaring_bitmap_at_js(this.#p, start),
        max = roaringWasm._roaring_bitmap_at_js(this.#p, end);
      return (
        0 > max && (max = 4294967296),
        this.rangeSet(0 > min ? max : min, max, output)
      );
    }
    sliceJoin(start = 0, end = 4294967296, separator) {
      let min = roaringWasm._roaring_bitmap_at_js(this.#p, start),
        max = roaringWasm._roaring_bitmap_at_js(this.#p, end);
      return (
        0 > max && (max = 4294967296),
        this.rangeJoin(0 > min ? max : min, max, separator)
      );
    }
    isEqual(other) {
      if (this === other) return !0;
      let a = this.#p;
      if (!a) return other.isEmpty;
      let b = other && other.#p;
      return b ? !!roaringWasm._roaring_bitmap_equals(a, b) : this.isEmpty;
    }
    optimize() {
      return (
        this.#frozen && _throwFrozen(),
        !!roaringWasm._roaring_bitmap_optimize_js(this.#p)
      );
    }
    select(rank) {
      return (
        0 > rank && (rank = this.size + rank),
        roaringWasm._roaring_bitmap_select_js(this.#p, rank)
      );
    }
    at(index) {
      let result = roaringWasm._roaring_bitmap_at_js(this.#p, index);
      return 0 > result ? void 0 : result;
    }
    indexOf(value) {
      return roaringWasm._roaring_bitmap_get_index_js(this.#p, value);
    }
    andCardinality(other) {
      let a = this.#p,
        b = other.#p;
      return a && b
        ? a === b
          ? this.size
          : roaringWasm._roaring_bitmap_and_cardinality(a, b) >>> 0
        : 0;
    }
    orCardinality(other) {
      let a = this.#p,
        b = other.#p;
      return b && a !== b
        ? a
          ? roaringWasm._roaring_bitmap_or_cardinality(a, b) >>> 0
          : other.size
        : this.size;
    }
    andNotCardinality(other) {
      let a = this.#p;
      return a
        ? roaringWasm._roaring_bitmap_andnot_cardinality(
            a,
            other.#p || other.#createEmpty(),
          ) >>> 0
        : 0;
    }
    xorCardinality(other) {
      let a = this.#p,
        b = other.#p;
      return a
        ? b
          ? roaringWasm._roaring_bitmap_xor_cardinality(a, b) >>> 0
          : this.size
        : other.size;
    }
    andInPlace(other) {
      this.#frozen && _throwFrozen();
      let a = this.#p;
      if (a) {
        let b = other.#p;
        a !== b &&
          (b
            ? (roaringWasm._roaring_bitmap_and_inplace(a, b), this.invalidate())
            : this.clear());
      }
    }
    orInPlace(other) {
      this.#frozen && _throwFrozen();
      let a = this.#p,
        b = other.#p;
      return (
        a
          ? b &&
            a !== b &&
            (roaringWasm._roaring_bitmap_or_inplace(a, b), this.invalidate())
          : b && this.overwrite(other),
        this
      );
    }
    xorInPlace(other) {
      this.#frozen && _throwFrozen();
      let a = this.#p,
        b = other.#p;
      return (
        a
          ? b &&
            (a === b
              ? this.clear()
              : (roaringWasm._roaring_bitmap_xor_inplace(a, b),
                this.invalidate()))
          : b && this.overwrite(other),
        this
      );
    }
    andNotInPlace(other) {
      this.#frozen && _throwFrozen();
      let a = this.#p;
      return (
        a &&
          (roaringWasm._roaring_bitmap_andnot_inplace(
            a,
            other.#p || other.#createEmpty(),
          ),
          this.invalidate()),
        this
      );
    }
    rank(value) {
      let ptr = this.#p;
      return ptr ? roaringWasm._roaring_bitmap_rank(ptr, value) >>> 0 : 0;
    }
    intersects(other) {
      let a = this.#p,
        b = other.#p;
      return !!(a && b && roaringWasm._roaring_bitmap_intersect(a, b));
    }
    intersectsWithRange(rangeStart = 0, rangeEnd = 4294967296) {
      return !!roaringWasm._roaring_bitmap_intersect_with_range_js(
        this.#p,
        rangeStart,
        rangeEnd,
      );
    }
    jaccardIndex(other) {
      return roaringWasm._roaring_bitmap_jaccard_index_js(this.#p, other.#p);
    }
    removeRunCompression() {
      this.#frozen && _throwFrozen();
      let ptr = this.#p;
      return !!ptr && !!roaringWasm._roaring_bitmap_remove_run_compression(ptr);
    }
    runOptimize() {
      this.#frozen && _throwFrozen();
      let ptr = this.#p;
      return !!ptr && !!roaringWasm._roaring_bitmap_run_optimize(ptr);
    }
    shrinkToFit() {
      return (
        this.#frozen && _throwFrozen(),
        roaringWasm._roaring_bitmap_shrink_to_fit_js(this.#p)
      );
    }
    static and(a, b) {
      let result = new _RoaringBitmap32();
      return (
        result.#setPtr(roaringWasm._roaring_bitmap_and_js(a.#p, b.#p)), result
      );
    }
    static or(a, b) {
      let result = new _RoaringBitmap32();
      return (
        result.#setPtr(roaringWasm._roaring_bitmap_or_js(a.#p, b.#p)), result
      );
    }
    static xor(a, b) {
      let result = new _RoaringBitmap32();
      return (
        result.#setPtr(roaringWasm._roaring_bitmap_xor_js(a.#p, b.#p)), result
      );
    }
    static andNot(a, b) {
      let result = new _RoaringBitmap32();
      return (
        result.#setPtr(roaringWasm._roaring_bitmap_andnot_js(a.#p, b.#p)),
        result
      );
    }
    static orMany(bitmaps) {
      let len = bitmaps.length,
        result = new _RoaringBitmap32();
      if (len > 0) {
        let mem = roaringWasm._jsalloc_unsafe(len << 2);
        try {
          let count = this.#orManyPtrs(mem, len, bitmaps);
          count &&
            result.#setPtr(roaringWasm._roaring_bitmap_or_many(count, mem));
        } finally {
          roaringWasm._free(mem);
        }
      }
      return result;
    }
    static orManyHeap(bitmaps) {
      let len = bitmaps.length,
        result = new _RoaringBitmap32();
      if (len > 0) {
        let mem = roaringWasm._jsalloc_unsafe(len << 2);
        try {
          let count = this.#orManyPtrs(mem, len, bitmaps);
          count &&
            result.#setPtr(
              roaringWasm._roaring_bitmap_or_many_heap(count, mem),
            );
        } finally {
          roaringWasm._free(mem);
        }
      }
      return result;
    }
    static xorMany(bitmaps) {
      let len = bitmaps.length,
        result = new _RoaringBitmap32();
      if (len > 0) {
        let mem = roaringWasm._jsalloc_unsafe(len << 2);
        try {
          let p = mem >>> 2,
            ptrArray = roaringWasm.HEAPU32.subarray(p, p + 4 * len),
            count = 0;
          for (let i = 0; len > i; ++i) {
            let v = bitmaps[i];
            if (v) {
              let ptr = v.#p || v.#createEmpty();
              ptr && (ptrArray[count++] = ptr);
            }
          }
          count &&
            result.#setPtr(roaringWasm._roaring_bitmap_xor_many(count, mem));
        } finally {
          roaringWasm._free(mem);
        }
      }
      return result;
    }
    static swap(a, b) {
      if (((0 > a.#v || 0 > b.#v) && _throwFrozen(), a !== b)) {
        let aptr = a.#p,
          bptr = b.#p;
        !1 === aptr && a.throwIfDisposed(),
          !1 === bptr && b.throwIfDisposed(),
          _finalizationRegistry &&
            (_finalizationRegistry.unregister(a),
            _finalizationRegistry.unregister(b));
        let asz = a.#size,
          bsz = b.#size;
        (a.#p = 0),
          (b.#p = 0),
          a.#setPtr(bptr),
          b.#setPtr(aptr),
          (a.#size = bsz),
          (b.#size = asz);
      }
    }
    invalidate() {
      (this.#size = -1), ++this.#v;
    }
    #setPtr(newPtr) {
      let oldPtr = this.#p;
      oldPtr !== newPtr &&
        (oldPtr &&
          (_finalizationRegistry && _finalizationRegistry.unregister(this),
          roaringWasm._roaring_bitmap_free(oldPtr)),
        (this.#p = newPtr),
        newPtr &&
          (_finalizationRegistry
            ? _finalizationRegistry.register(this, newPtr, this)
            : "u" > typeof FinalizationRegistry &&
              (_finalizationRegistry = new FinalizationRegistry(
                roaringWasm._roaring_bitmap_free,
              )).register(this, newPtr, this)),
        (oldPtr || newPtr) && this.invalidate());
    }
    #createEmpty() {
      let ptr = this.#p;
      if (!1 === ptr) throw new TypeError("RoaringBitmap32 was disposed");
      if (((ptr = roaringWasm._roaring_bitmap_create_js()), !ptr))
        throw Error("Failed to allocate RoaringBitmap32");
      return (
        _finalizationRegistry
          ? _finalizationRegistry.register(this, ptr, this)
          : "u" > typeof FinalizationRegistry &&
            (_finalizationRegistry = new FinalizationRegistry(
              roaringWasm._roaring_bitmap_free,
            )).register(this, ptr, this),
        (this.#p = ptr),
        (this.#size = 0),
        ptr
      );
    }
    #addTypedArray(values) {
      let len = values.length;
      if (len > 0) {
        let mem =
          roaringWasm._roaring_sync_bulk_add_init(
            this.#p || this.#createEmpty(),
          ) >>> 2;
        if (0 !== mem) {
          let { HEAPU32, _roaring_sync_bulk_add_chunk } = roaringWasm;
          if (len > 983040)
            for (let readOffset = 0; ; ) {
              let readSize = len - readOffset;
              readSize > 983040 && (readSize = 983040);
              let readEnd = readOffset + readSize;
              if (
                (HEAPU32.set(values.subarray(readOffset, readEnd), mem),
                _roaring_sync_bulk_add_chunk(readSize),
                readEnd >= len)
              )
                break;
              readOffset = readEnd;
            }
          else HEAPU32.set(values, mem), _roaring_sync_bulk_add_chunk(len);
          this.invalidate();
        }
      }
    }
    #addIterable(values) {
      let mem =
        roaringWasm._roaring_sync_bulk_add_init(
          this.#p || this.#createEmpty(),
        ) >>> 2;
      if (0 !== mem) {
        let { HEAPU32, _roaring_sync_bulk_add_chunk } = roaringWasm,
          changed = !1,
          n = 0;
        for (let value of values)
          null != value &&
            !1 !== value &&
            "" !== value &&
            ((value = +value),
            value > -1 &&
              4294967296 > value &&
              ((HEAPU32[mem + n++] = value),
              983040 === n &&
                (_roaring_sync_bulk_add_chunk(n), (n = 0), (changed = !0))));
        n > 0 && (_roaring_sync_bulk_add_chunk(n), (changed = !0)),
          changed && this.invalidate();
      }
    }
    #removeTypedArray(values) {
      let len = values.length;
      if (len > 0) {
        let mem = roaringWasm._roaring_sync_bulk_remove_init(this.#p) >>> 2,
          { HEAPU32, _roaring_sync_bulk_remove_chunk } = roaringWasm;
        if (len > 983040)
          for (let readOffset = 0; ; ) {
            let readSize = len - readOffset;
            readSize > 983040 && (readSize = 983040);
            let readEnd = readOffset + readSize;
            if (
              (HEAPU32.set(values.subarray(readOffset, readEnd), mem),
              _roaring_sync_bulk_remove_chunk(readSize),
              readEnd >= len)
            )
              break;
            readOffset = readEnd;
          }
        else HEAPU32.set(values, mem), _roaring_sync_bulk_remove_chunk(len);
        this.invalidate();
      }
    }
    #removeIterable(values) {
      let mem = roaringWasm._roaring_sync_bulk_remove_init(this.#p) >>> 2,
        { HEAPU32, _roaring_sync_bulk_remove_chunk } = roaringWasm,
        changed = !1,
        n = 0;
      for (let value of values)
        null != value &&
          !1 !== value &&
          "" !== value &&
          ((value = +value),
          value > -1 &&
            4294967296 > value &&
            ((HEAPU32[mem + n++] = value),
            983040 === n &&
              (_roaring_sync_bulk_remove_chunk(n), (n = 0), (changed = !0))));
      n > 0 && (_roaring_sync_bulk_remove_chunk(n), (changed = !0)),
        changed && this.invalidate();
    }
    static #orManyPtrs(mem, len, bitmaps) {
      let p = mem >>> 2,
        ptrArray = roaringWasm.HEAPU32.subarray(p, p + 4 * len),
        count = 0;
      for (let i = 0; len > i; ++i) {
        let v = bitmaps[i];
        if (v) {
          let ptr = v.#p;
          ptr && (ptrArray[count++] = ptr);
        }
      }
      return count;
    }
    get _p() {
      return this.#p;
    }
  },
  proto = RoaringBitmap32.prototype;

proto.remove = proto.delete;

proto.contains = proto.has;

proto.includes = proto.has;

Object.defineProperty(
  proto,
  "length",
  Object.getOwnPropertyDescriptor(proto, "size"),
);

exports.DeserializationFormat = DeserializationFormat;

exports.RoaringArenaAllocator = class _RoaringArenaAllocator {
  #refs;
  #escaped;
  #started;
  static get current() {
    return _roaringArenaAllocator_head;
  }
  static start() {
    return new _RoaringArenaAllocator().start();
  }
  static stop() {
    return _roaringArenaAllocator_head && _roaringArenaAllocator_head.stop();
  }
  get size() {
    let refs = this.#refs;
    return refs ? refs.size : 0;
  }
  get escaped() {
    let escaped = this.#escaped;
    return escaped ? escaped.size : 0;
  }
  static with(fn, allocator = new _RoaringArenaAllocator()) {
    allocator.with(fn);
  }
  constructor() {
    (this.#refs = null), (this.#escaped = null), (this.#started = 0);
  }
  disposeAll() {
    let refs = this.#refs,
      result = 0;
    if (refs) {
      let escaped = this.#escaped;
      this.#refs = null;
      for (let ref of refs)
        ref && (!escaped || !escaped.has(ref)) && dispose(ref) && ++result;
    }
    return result;
  }
  start() {
    return (
      ++this.#started,
      (_stack || (_stack = [])).push((_roaringArenaAllocator_head = this)),
      this
    );
  }
  stop() {
    return (
      this.#started > 0 &&
        (((allocator) => {
          let stack = _stack;
          if (_roaringArenaAllocator_head === allocator)
            stack.pop(),
              (_roaringArenaAllocator_head = stack[stack.length - 1] || null);
          else {
            let index = stack.lastIndexOf(allocator);
            index >= 0 && stack.splice(index, 1);
          }
        })(this),
        --this.#started),
      this.disposeAll(),
      this
    );
  }
  with(fn) {
    this.start();
    try {
      return fn(this);
    } finally {
      this.stop();
    }
  }
  register(disposable) {
    return (
      (this.#refs || (this.#refs = /* @__PURE__ */ new Set())).add(disposable),
      disposable
    );
  }
  unregister(disposable) {
    let refs = this.#refs;
    return !!refs && refs.delete(disposable);
  }
  escape(disposable) {
    return (
      (this.#escaped || (this.#escaped = /* @__PURE__ */ new Set())).add(
        disposable,
      ),
      disposable
    );
  }
  newRoaringUint8Array(lengthOrArray) {
    return new RoaringUint8Array(lengthOrArray, this);
  }
  newRoaringBitmap32Iterator(bitmap) {
    return new RoaringBitmap32Iterator(bitmap, this);
  }
  newRoaringBitmap32(valuesOrCapacity) {
    return new RoaringBitmap32(valuesOrCapacity, this);
  }
};

exports.RoaringBitmap32 = RoaringBitmap32;

exports.RoaringBitmap32Iterator = RoaringBitmap32Iterator;

exports.RoaringUint8Array = RoaringUint8Array;

exports.SerializationFormat = SerializationFormat;

exports.dispose = dispose;

exports.disposeAll = disposeAll;

exports.disposeThis = disposeThis;

exports.isDisposable = isDisposable;

exports.roaringLibraryInitialize = () => _initializePromise;

exports.roaringLibraryIsReady = () => !!roaringWasm;

exports.tryDispose = tryDispose;

exports.using = (disposable, what) => {
  let result;
  try {
    if (
      ((result = "function" == typeof what ? what(disposable) : what),
      "object" == typeof result &&
        null !== result &&
        "function" == typeof result.then)
    )
      return (
        "function" == typeof result.finally
          ? result
          : (async (thenable) => thenable)(result)
      ).finally(disposeThis.bind(disposable));
  } catch (e) {
    throw (tryDispose(disposable), e);
  }
  return dispose(disposable), result;
};

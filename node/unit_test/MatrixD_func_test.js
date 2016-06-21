// Generated by CoffeeScript 1.10.0
(function() {
  var AbsoluteError, JC, assert, colors, dumpMatrix;

  assert = require("assert");

  colors = require("colors");

  JC = require("../JC.js");

  colors.setTheme({
    warmup: 'black',
    cpu: 'cyan',
    gpu: 'green',
    standardIEEE: ['white', 'underline']
  });

  AbsoluteError = 1e-6;

  JC.cudaDeviceInit();

  dumpMatrix = function(mat) {
    var c, k, l, oneRow, r, ref, ref1, results;
    results = [];
    for (r = k = 0, ref = mat.numRow; 0 <= ref ? k < ref : k > ref; r = 0 <= ref ? ++k : --k) {
      oneRow = "[";
      for (c = l = 0, ref1 = mat.numCol; 0 <= ref1 ? l < ref1 : l > ref1; c = 0 <= ref1 ? ++l : --l) {
        oneRow += mat.elements[c * mat.numRow + r] + " ";
      }
      oneRow += "]";
      results.push(console.log("" + oneRow));
    }
    return results;
  };

  describe("MatrixD Functions Validation Test", function() {
    this.timeout(0);
    it("matrix multiply scalar: ...", function() {
      var _, colorLog, end, gpuResult, i, k, l, len, len1, len2, m, matAd, meanError, mid, num, ref, ref1, scalar, start, testLength, tip, v1h, warmUpLength;
      testLength = 1e3;
      warmUpLength = 10;
      ref = [testLength];
      for (k = 0, len1 = ref.length; k < len1; k++) {
        len = ref[k];
        v1h = new Float32Array((function() {
          var l, ref1, results;
          results = [];
          for (num = l = 0, ref1 = len * len; 0 <= ref1 ? l < ref1 : l > ref1; num = 0 <= ref1 ? ++l : --l) {
            results.push(Math.random());
          }
          return results;
        })());
        gpuResult = new Float32Array(len * len);
        matAd = new JC.MatrixD(len, len, v1h);
        scalar = Math.random();
        start = Date.now();
        matAd.multiplyScalar(scalar);
        if (len === warmUpLength) {
          tip = "Warm up pass ";
          colorLog = "warmup";
        } else {
          tip = "";
          colorLog = "gpu";
        }
        matAd.copyTo(matAd.numRow * matAd.numCol, gpuResult);
        mid = Date.now();
        matAd.copyTo(matAd.numRow * matAd.numCol, gpuResult);
        end = Date.now();
        console.log(("\t" + tip + "JC(GPU) <<< MatrixD::multiplyVector >>> " + len + "x" + len + " * " + testLength + " elements used:" + (Math.max(mid - start - (end - mid), 0)) + " ms")[colorLog]);
        matAd.destroy();
      }
      start = Date.now();
      for (i = l = 0, ref1 = len * len; 0 <= ref1 ? l < ref1 : l > ref1; i = 0 <= ref1 ? ++l : --l) {
        v1h[i] *= scalar;
      }
      colorLog = "cpu";
      console.log(("\t" + tip + "V8(CPU) <<< matrix multiply vector >>> " + testLength + "x" + testLength + " * " + testLength + " elements used:" + (Date.now() - start) + " ms")[colorLog]);
      meanError = 0;
      for (i = m = 0, len2 = v1h.length; m < len2; i = ++m) {
        _ = v1h[i];
        meanError += v1h[i] - gpuResult[i];
      }
      meanError /= v1h.length;
      colorLog = "standardIEEE";
      console.log(("\tv8.CPU vs jc.GPU Mean absolute error: " + meanError + " , \<float32\> refer to IEEE-754")[colorLog]);
      return assert((AbsoluteError > meanError && meanError > -AbsoluteError), "test failed");
    });
    it("matrix multiply vector: ...", function() {
      var _, colorLog, cpuresult, element, end, gpuResult, i, j, k, l, len, len1, len2, m, matAd, meanError, mid, n, num, r, ref, ref1, ref2, start, testLength, tip, v1e, v1h, v2e, v2h, vBd, vCd, warmUpLength;
      testLength = 1e3;
      warmUpLength = 10;
      ref = [testLength];
      for (k = 0, len1 = ref.length; k < len1; k++) {
        len = ref[k];
        v1h = new Float32Array((function() {
          var l, ref1, results;
          results = [];
          for (num = l = 0, ref1 = len * len; 0 <= ref1 ? l < ref1 : l > ref1; num = 0 <= ref1 ? ++l : --l) {
            results.push(Math.random());
          }
          return results;
        })());
        v2h = new Float32Array((function() {
          var l, ref1, results;
          results = [];
          for (num = l = 0, ref1 = len; 0 <= ref1 ? l < ref1 : l > ref1; num = 0 <= ref1 ? ++l : --l) {
            results.push(Math.random());
          }
          return results;
        })());
        gpuResult = new Float32Array(len);
        matAd = new JC.MatrixD(len, len, v1h);
        vBd = new JC.VectorD(v2h.length, v2h);
        vCd = new JC.VectorD(len);
        start = Date.now();
        matAd.multiplyVector(vBd, vCd);
        if (len === warmUpLength) {
          tip = "Warm up pass ";
          colorLog = "warmup";
        } else {
          tip = "";
          colorLog = "gpu";
        }
        vCd.copyTo(vCd.length, gpuResult);
        mid = Date.now();
        vCd.copyTo(vCd.length, gpuResult);
        end = Date.now();
        console.log(("\t" + tip + "JC(GPU) <<< MatrixD::multiplyVector >>> " + len + "x" + len + " * " + testLength + " elements used:" + (Math.max(mid - start - (end - mid), 0)) + " ms")[colorLog]);
        matAd.destroy();
        vBd.destroy();
        vCd.destroy();
      }
      cpuresult = new Float32Array(gpuResult.length);
      start = Date.now();
      for (r = l = 0, ref1 = len; 0 <= ref1 ? l < ref1 : l > ref1; r = 0 <= ref1 ? ++l : --l) {
        element = 0;
        for (j = m = 0, ref2 = len; 0 <= ref2 ? m < ref2 : m > ref2; j = 0 <= ref2 ? ++m : --m) {
          v1e = v1h[j * len + r];
          v2e = v2h[j];
          element += v1e * v2e;
        }
        cpuresult[r] = element;
      }
      colorLog = "cpu";
      console.log(("\t" + tip + "V8(CPU) <<< matrix multiply vector >>> " + testLength + "x" + testLength + " * " + testLength + " elements used:" + (Date.now() - start) + " ms")[colorLog]);
      meanError = 0;
      for (i = n = 0, len2 = cpuresult.length; n < len2; i = ++n) {
        _ = cpuresult[i];
        meanError += cpuresult[i] - gpuResult[i];
      }
      meanError /= cpuresult.length;
      colorLog = "standardIEEE";
      console.log(("\tv8.CPU vs jc.GPU Mean absolute error: " + meanError + " , \<float32\> refer to IEEE-754")[colorLog]);
      return assert((AbsoluteError > meanError && meanError > -AbsoluteError), "test failed");
    });
    it("matrix's transpose multiply vector: ...", function() {
      var _, colorLog, cpuresult, element, end, gpuResult, i, j, k, l, len, len1, len2, m, matAd, meanError, mid, n, num, r, ref, ref1, ref2, start, testLength, tip, v1e, v1h, v2e, v2h, vBd, vCd, warmUpLength;
      testLength = 1e3;
      warmUpLength = 10;
      ref = [testLength];
      for (k = 0, len1 = ref.length; k < len1; k++) {
        len = ref[k];
        v1h = new Float32Array((function() {
          var l, ref1, results;
          results = [];
          for (num = l = 0, ref1 = len * len; 0 <= ref1 ? l < ref1 : l > ref1; num = 0 <= ref1 ? ++l : --l) {
            results.push(Math.random());
          }
          return results;
        })());
        v2h = new Float32Array((function() {
          var l, ref1, results;
          results = [];
          for (num = l = 0, ref1 = len; 0 <= ref1 ? l < ref1 : l > ref1; num = 0 <= ref1 ? ++l : --l) {
            results.push(Math.random());
          }
          return results;
        })());
        gpuResult = new Float32Array(len);
        matAd = new JC.MatrixD(len, len, v1h);
        vBd = new JC.VectorD(v2h.length, v2h);
        vCd = new JC.VectorD(len);
        start = Date.now();
        matAd.T().multiplyVector(vBd, vCd);
        if (len === warmUpLength) {
          tip = "Warm up pass ";
          colorLog = "warmup";
        } else {
          tip = "";
          colorLog = "gpu";
        }
        vCd.copyTo(vCd.length, gpuResult);
        mid = Date.now();
        vCd.copyTo(vCd.length, gpuResult);
        end = Date.now();
        console.log(("\t" + tip + "JC(GPU) <<< MatrixD::T::multiplyVector >>> " + len + "x" + len + " * " + testLength + " elements used:" + (Math.max(mid - start - (end - mid), 0)) + " ms")[colorLog]);
        matAd.destroy();
        vBd.destroy();
        vCd.destroy();
      }
      cpuresult = new Float32Array(gpuResult.length);
      start = Date.now();
      for (r = l = 0, ref1 = len; 0 <= ref1 ? l < ref1 : l > ref1; r = 0 <= ref1 ? ++l : --l) {
        element = 0;
        for (j = m = 0, ref2 = len; 0 <= ref2 ? m < ref2 : m > ref2; j = 0 <= ref2 ? ++m : --m) {
          v1e = v1h[r * len + j];
          v2e = v2h[j];
          element += v1e * v2e;
        }
        cpuresult[r] = element;
      }
      colorLog = "cpu";
      console.log(("\t" + tip + "V8(CPU) <<< matrix's transpose multiply vector >>> " + testLength + "x" + testLength + " * " + testLength + " elements used:" + (Date.now() - start) + " ms")[colorLog]);
      meanError = 0;
      for (i = n = 0, len2 = cpuresult.length; n < len2; i = ++n) {
        _ = cpuresult[i];
        meanError += cpuresult[i] - gpuResult[i];
      }
      meanError /= cpuresult.length;
      colorLog = "standardIEEE";
      console.log(("\tv8.CPU vs jc.GPU Mean absolute error: " + meanError + " , \<float32\> refer to IEEE-754")[colorLog]);
      return assert((AbsoluteError > meanError && meanError > -AbsoluteError), "test failed");
    });
    it("matrix multiplication: ...", function() {
      var _, c, colorLog, cpuresult, element, end, gpuResult, i, j, k, l, len, len1, len2, m, matAd, matBd, matCd, meanError, mid, n, num, o, r, ref, ref1, ref2, ref3, start, testLength, tip, v1e, v1h, v2e, v2h, warmUpLength;
      testLength = 1e3;
      warmUpLength = 10;
      ref = [testLength];
      for (k = 0, len1 = ref.length; k < len1; k++) {
        len = ref[k];
        v1h = new Float32Array((function() {
          var l, ref1, results;
          results = [];
          for (num = l = 0, ref1 = len * len; 0 <= ref1 ? l < ref1 : l > ref1; num = 0 <= ref1 ? ++l : --l) {
            results.push(Math.random());
          }
          return results;
        })());
        v2h = new Float32Array((function() {
          var l, ref1, results;
          results = [];
          for (num = l = 0, ref1 = len * len; 0 <= ref1 ? l < ref1 : l > ref1; num = 0 <= ref1 ? ++l : --l) {
            results.push(Math.random());
          }
          return results;
        })());
        gpuResult = new Float32Array(len * len);
        matAd = new JC.MatrixD(len, len, v1h);
        matBd = new JC.MatrixD(len, len, v2h);
        matCd = new JC.MatrixD(len, len);
        start = Date.now();
        matAd.multiplyMatrix(matBd, matCd);
        if (len === warmUpLength) {
          tip = "Warm up pass ";
          colorLog = "warmup";
        } else {
          tip = "";
          colorLog = "gpu";
        }
        matCd.copyTo(matCd.numCol * matCd.numRow, gpuResult);
        mid = Date.now();
        matCd.copyTo(matCd.numCol * matCd.numRow, gpuResult);
        end = Date.now();
        console.log(("\t" + tip + "JC(GPU) <<< MatrixD::multiplyMatrix >>> " + len + "x" + len + " * " + len + "x" + len + " elements used:" + (Math.max(mid - start - (end - mid), 0)) + " ms")[colorLog]);
        matAd.destroy();
        matBd.destroy();
        matCd.destroy();
      }
      cpuresult = new Float32Array(gpuResult.length);
      start = Date.now();
      for (r = l = 0, ref1 = len; 0 <= ref1 ? l < ref1 : l > ref1; r = 0 <= ref1 ? ++l : --l) {
        for (c = m = 0, ref2 = len; 0 <= ref2 ? m < ref2 : m > ref2; c = 0 <= ref2 ? ++m : --m) {
          element = 0;
          for (j = n = 0, ref3 = len; 0 <= ref3 ? n < ref3 : n > ref3; j = 0 <= ref3 ? ++n : --n) {
            v1e = v1h[j * len + r];
            v2e = v2h[c * len + j];
            element += v1e * v2e;
          }
          cpuresult[c * len + r] = element;
        }
      }
      colorLog = "cpu";
      console.log(("\t" + tip + "V8(CPU) <<< matrix multiplication >>> " + testLength + "x" + testLength + " * " + testLength + "x" + testLength + " elements used:" + (Date.now() - start) + " ms")[colorLog]);
      meanError = 0;
      for (i = o = 0, len2 = cpuresult.length; o < len2; i = ++o) {
        _ = cpuresult[i];
        meanError += cpuresult[i] - gpuResult[i];
      }
      meanError /= cpuresult.length;
      colorLog = "standardIEEE";
      console.log(("\tv8.CPU vs jc.GPU Mean absolute error: " + meanError + " , \<float32\> refer to IEEE-754")[colorLog]);
      return assert((AbsoluteError > meanError && meanError > -AbsoluteError), "test failed");
    });
    it("matrices' transposes' multiplication: ...", function() {
      var _, c, colorLog, cpuresult, element, end, gpuResult, i, j, k, l, len, len1, len2, m, matAd, matBd, matCd, meanError, mid, n, num, o, r, ref, ref1, ref2, ref3, start, testLength, tip, v1e, v1h, v2e, v2h, warmUpLength;
      testLength = 1e3;
      warmUpLength = 10;
      ref = [testLength];
      for (k = 0, len1 = ref.length; k < len1; k++) {
        len = ref[k];
        v1h = new Float32Array((function() {
          var l, ref1, results;
          results = [];
          for (num = l = 0, ref1 = len * len; 0 <= ref1 ? l < ref1 : l > ref1; num = 0 <= ref1 ? ++l : --l) {
            results.push(Math.random());
          }
          return results;
        })());
        v2h = new Float32Array((function() {
          var l, ref1, results;
          results = [];
          for (num = l = 0, ref1 = len * len; 0 <= ref1 ? l < ref1 : l > ref1; num = 0 <= ref1 ? ++l : --l) {
            results.push(Math.random());
          }
          return results;
        })());
        gpuResult = new Float32Array(len * len);
        matAd = new JC.MatrixD(len, len, v1h);
        matBd = new JC.MatrixD(len, len, v2h);
        matCd = new JC.MatrixD(len, len);
        start = Date.now();
        matAd.T().multiplyMatrix(matBd.T(), matCd);
        if (len === warmUpLength) {
          tip = "Warm up pass ";
          colorLog = "warmup";
        } else {
          tip = "";
          colorLog = "gpu";
        }
        matCd.copyTo(matCd.numCol * matCd.numRow, gpuResult);
        mid = Date.now();
        matCd.copyTo(matCd.numCol * matCd.numRow, gpuResult);
        end = Date.now();
        console.log(("\t" + tip + "JC(GPU) <<< MatrixD::T::multiplyMatrix >>> " + len + "x" + len + " * " + len + "x" + len + " elements used:" + (Math.max(mid - start - (end - mid), 0)) + " ms")[colorLog]);
        matAd.destroy();
        matBd.destroy();
        matCd.destroy();
      }
      cpuresult = new Float32Array(gpuResult.length);
      start = Date.now();
      for (r = l = 0, ref1 = len; 0 <= ref1 ? l < ref1 : l > ref1; r = 0 <= ref1 ? ++l : --l) {
        for (c = m = 0, ref2 = len; 0 <= ref2 ? m < ref2 : m > ref2; c = 0 <= ref2 ? ++m : --m) {
          element = 0;
          for (j = n = 0, ref3 = len; 0 <= ref3 ? n < ref3 : n > ref3; j = 0 <= ref3 ? ++n : --n) {
            v1e = v1h[r * len + j];
            v2e = v2h[j * len + c];
            element += v1e * v2e;
          }
          cpuresult[c * len + r] = element;
        }
      }
      colorLog = "cpu";
      console.log(("\t" + tip + "V8(CPU) <<< matrices' transposes' multiplication >>> " + testLength + "x" + testLength + " * " + testLength + "x" + testLength + " elements used:" + (Date.now() - start) + " ms")[colorLog]);
      meanError = 0;
      for (i = o = 0, len2 = cpuresult.length; o < len2; i = ++o) {
        _ = cpuresult[i];
        meanError += cpuresult[i] - gpuResult[i];
      }
      meanError /= cpuresult.length;
      colorLog = "standardIEEE";
      console.log(("\tv8.CPU vs jc.GPU Mean absolute error: " + meanError + " , \<float32\> refer to IEEE-754")[colorLog]);
      return assert((AbsoluteError > meanError && meanError > -AbsoluteError), "test failed");
    });
    return it("matrices'batch multiplication: ...", function() {
      var batchA, batchB, batchC, hostOut, i, matrixWatch, mbdA, mbdB, mbdC, num;
      batchA = (function() {
        var k, results;
        results = [];
        for (i = k = 0; k < 1; i = ++k) {
          results.push(new JC.MatrixD(2, 2, new Float32Array((function() {
            var l, results1;
            results1 = [];
            for (num = l = 0; l < 4; num = ++l) {
              results1.push(num);
            }
            return results1;
          })())));
        }
        return results;
      })();
      batchB = (function() {
        var k, results;
        results = [];
        for (i = k = 0; k < 1; i = ++k) {
          results.push(new JC.MatrixD(2, 2, new Float32Array((function() {
            var l, results1;
            results1 = [];
            for (num = l = 0; l < 4; num = ++l) {
              results1.push(num);
            }
            return results1;
          })())));
        }
        return results;
      })();
      batchC = (function() {
        var k, results;
        results = [];
        for (i = k = 0; k < 1; i = ++k) {
          results.push(new JC.MatrixD(2, 2, new Float32Array((function() {
            var l, results1;
            results1 = [];
            for (num = l = 0; l < 4; num = ++l) {
              results1.push(num);
            }
            return results1;
          })())));
        }
        return results;
      })();
      matrixWatch = batchC[0];
      hostOut = new Float32Array(4);
      matrixWatch.copyTo(4, hostOut);
      console.log("Out-put before batch multiply: " + hostOut);
      mbdA = new JC.MatrixBatchD(2, 2, batchA);
      mbdB = new JC.MatrixBatchD(2, 2, batchB);
      mbdC = new JC.MatrixBatchD(2, 2, batchC);
      mbdA.T().multiplyMatrixBatch(mbdB, mbdC);
      matrixWatch.copyTo(4, hostOut);
      console.log("Out-put before batch multiply: " + hostOut);
      mbdA.destroy();
      mbdB.destroy();
      return mbdC.destroy();
    });
  });

}).call(this);

//# sourceMappingURL=MatrixD_func_test.js.map

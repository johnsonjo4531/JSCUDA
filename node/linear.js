// Generated by CoffeeScript 1.10.0
(function() {
  var JC, MatrixBatchD, MatrixD, UE, VectorD, exports;

  UE = require("./exception");

  JC = require("./jc/build/Debug/jc.node");

  VectorD = (function() {
    function VectorD(n, elements) {
      if (elements == null) {
        elements = void 0;
      }
      this.length = Math.ceil(n);
      this.elements = void 0;
      if (this.length < 1) {
        throw new UE.UserException("'n' <uint32> must greater than zero");
      }
      if (elements != null) {
        if (elements.length !== this.length) {
          throw new UE.UserException("'elements''s dimension mismatch");
        }
        if (elements instanceof JC.DeviceFloat32Array) {
          this.elements = elements;
        } else if (elements instanceof Float32Array) {
          this.elements = new JC.DeviceFloat32Array(this.length);
          this.copyFrom(this.length, elements);
        }
      } else {
        this.elements = new JC.DeviceFloat32Array(this.length);
      }
      if (!(this.elements instanceof JC.DeviceFloat32Array)) {
        throw new UE.UserException("'elements''s type mismatch");
      }
    }

    VectorD.prototype.destroy = function() {
      this.elements.destroy();
      this.length = 0;
      return void 0;
    };

    VectorD.prototype.copy = function(v) {
      if (!(v instanceof VectorD && (v.elements != null))) {
        throw new UE.UserException("'v' must be VectorD");
      }
      if (this.elements.length !== v.elements.length) {
        throw new UE.UserException("'v''s dimension' mismatch");
      }
      this.elements.copy(v.elements, 0, 0, this.elements.length);
      return this;
    };

    VectorD.prototype.copyFrom = function(n, array) {
      n = Math.ceil(n);
      if (n < 1) {
        throw new UE.UserException("'n' <uint32> must  greater than zero");
      }
      if (!(array instanceof Float32Array)) {
        throw new UE.UserException("'array' must be Float32Array");
      }
      if (n > array.length || n > this.elements.length) {
        throw new UE.UserException("'n' exceed range of array");
      }
      this.elements.copyFrom(array, 0, 0, n);
      return this;
    };

    VectorD.prototype.copyTo = function(n, array) {
      n = Math.ceil(n);
      if (n < 1) {
        throw new UE.UserException("'n' <uint32> must  greater than zero");
      }
      if (!(array instanceof Float32Array)) {
        throw new UE.UserException("'array' must be Float32Array");
      }
      if (n > array.length || n > this.elements.length) {
        throw new UE.UserException("'n' exceed range of array");
      }
      this.elements.copyTo(array, 0, 0, n);
      return this;
    };

    VectorD.prototype.add = function(v) {
      if (!(v instanceof VectorD && (v.elements != null))) {
        throw new UE.UserException("'v' must be VectorD");
      }
      if (v.length !== this.length) {
        throw new UE.UserException("'v''s dimension'' mismatch");
      }
      JC.vectorAdd(this, v);
      return this;
    };

    VectorD.prototype.dot = function(v) {
      if (!(v instanceof VectorD && (v.elements != null))) {
        throw new UE.UserException("'v' must be VectorD");
      }
      if (v.length !== this.length) {
        throw new UE.UserException("'v''s dimension' mismatch");
      }
      return JC.vectorDot(this, v);
    };

    VectorD.prototype.norm = function() {
      return JC.vectorNorm(this);
    };

    VectorD.prototype.normSq = function() {
      var norm;
      norm = JC.vectorNorm(this);
      return norm * norm;
    };

    VectorD.prototype.multiplyScalar = function(s) {
      if (!(typeof s === 'number')) {
        throw new UE.UserException("'s' must be number");
      }
      JC.vectorMulScalar(this, s);
      return this;
    };

    VectorD.prototype.tensor = function(v, m) {
      if (!(v instanceof VectorD && (v.elements != null))) {
        throw new UE.UserException("'v' must be VectorD");
      }
      if (!(m instanceof MatrixD && (m.elements != null))) {
        throw new UE.UserException("'m' must be MatrixD");
      }
      if (v.elements.length !== this.elements.length) {
        throw new UE.UserException("'v''s dimension' mismatch");
      }
      if (m.numRow !== this.length || m.numCol !== v.length) {
        throw new UE.UserException("'m''s dimension mismatch");
      }
      JC.vectorRank(this, v, m);
      return m;
    };

    return VectorD;

  })();

  MatrixD = (function() {
    function MatrixD(m, n, elements) {
      if (elements == null) {
        elements = void 0;
      }
      this.numRow = Math.ceil(m);
      this.numCol = Math.ceil(n);
      this.transposed = false;
      this.elements = void 0;
      if (this.numRow < 1 || this.numCol < 1) {
        throw new UE.UserException("'m, n' <uint32> must greater than zero");
      }
      if (elements != null) {
        if (elements.length !== this.numCol * this.numRow) {
          throw new UE.UserException("'elements''s dimension mismatch");
        }
        if (elements instanceof JC.DeviceFloat32Array) {
          this.elements = elements;
        } else if (elements instanceof Float32Array) {
          this.elements = new JC.DeviceFloat32Array(elements.length);
          this.copyFrom(elements.length, elements);
        }
      } else {
        this.elements = new JC.DeviceFloat32Array(this.numCol * this.numRow);
      }
      if (!(this.elements instanceof JC.DeviceFloat32Array)) {
        throw new UE.UserException("'elements''s type mismatch");
      }
    }

    MatrixD.prototype.destroy = function() {
      this.elements.destroy();
      this.elements = void 0;
      this.numRow = 0;
      this.numCol = 0;
      return void 0;
    };

    MatrixD.prototype.T = function() {
      var t;
      t = new MatrixD(this.numCol, this.numRow, this.elements);
      t.transposed = true;
      return t;
    };

    MatrixD.prototype.copy = function(m) {
      if (!(m instanceof MatrixD && (m.elements != null))) {
        throw new UE.UserException("'m' must be MatrixD");
      }
      if (this.elements.length !== m.elements.length || this.numRow !== m.numRow || this.numCol !== m.numCol) {
        throw new UE.UserException("'m''s dimension mismatch");
      }
      this.elements.copy(m.elements, 0, 0, this.elements.length);
      this.transposed = m.transposed;
      return this;
    };

    MatrixD.prototype.copyFrom = function(n, array) {
      n = Math.ceil(n);
      if (n < 1) {
        throw new UE.UserException("'n' <uint32> must  greater than zero");
      }
      if (!(array instanceof Float32Array)) {
        throw new UE.UserException("'array' must be Float32Array");
      }
      if (n > array.length || n > this.elements.length) {
        throw new UE.UserException("'n' exceed range of array");
      }
      this.elements.copyFrom(array, 0, 0, n);
      return this;
    };

    MatrixD.prototype.copyTo = function(n, array) {
      n = Math.ceil(n);
      if (n < 1) {
        throw new UE.UserException("'n' <uint32> must  greater than zero");
      }
      if (!(array instanceof Float32Array)) {
        throw new UE.UserException("'array' must be Float32Array");
      }
      if (n > array.length || n > this.elements.length) {
        throw new UE.UserException("'n' exceed range of array");
      }
      this.elements.copyTo(array, 0, 0, n);
      return this;
    };

    MatrixD.prototype.multiplyScalar = function(s) {
      if (!(typeof s === 'number')) {
        throw new UE.UserException("'s' must be number");
      }
      JC.matrixMulScalar(this, s);
      return this;
    };

    MatrixD.prototype.multiplyMatrix = function(mb, mc) {
      if (!(mb instanceof MatrixD && (mb.elements != null) && mc instanceof MatrixD && (mc.elements != null))) {
        throw new UE.UserException("'mb, mc' must be MatrixD");
      }
      if (this.numCol !== mb.numRow || this.numRow !== mc.numRow || mb.numCol !== mc.numCol) {
        throw new UE.UserException("'mb, mc''s dimension mismatch");
      }
      JC.matrixMulMatrix(this, mb, mc);
      mc.transposed = false;
      return mc;
    };

    MatrixD.prototype.multiplyVector = function(va, vb) {
      var ref;
      if (!(va instanceof VectorD && vb instanceof VectorD && (va.elements != null) && (vb.elements != null))) {
        throw new UE.UserException("'va, vb' must be VectorD");
      }
      if ((this.numCol !== (ref = va.length) && ref !== vb.length)) {
        throw new UE.UserException("'va, vb''s dimension mismatch");
      }
      JC.matrixMulVector(this, va, vb);
      return vb;
    };

    MatrixD.prototype.add = function(mb, mc) {
      if (!(mb instanceof MatrixD && (mb.elements != null))) {
        throw new UE.UserException("'mb' must be MatrixD");
      }
      if (!(mc instanceof MatrixD && (mc.elements != null))) {
        throw new UE.UserException("'mc' must be MatrixD");
      }
      if (this.numCol !== mb.numRow || this.numRow !== mc.numRow || mb.numCol !== mc.numCol) {
        throw new UE.UserException("'mb, mc''s dimension mismatch");
      }
      JC.matrixAdd(this, mb, mc);
      return mc;
    };

    MatrixD.prototype.setZero = function() {
      return this.elements.setValue(0);
    };

    return MatrixD;

  })();

  MatrixBatchD = (function() {
    function MatrixBatchD(m, n, matrices) {
      var i, len;
      this.numRow = Math.ceil(m);
      this.numCol = Math.ceil(n);
      this.transposed = false;
      this.count = 0;
      this.MatrixDArray = [];
      this.elementsArray = [];
      this.batchPointerArray = void 0;
      if (this.numRow < 1 || this.numCol < 1) {
        throw new UE.UserException("'m, n' <uint32> must greater than zero");
      }
      if (matrices instanceof Array && matrices.length > 0) {
        for (i = 0, len = matrices.length; i < len; i++) {
          m = matrices[i];
          if (!(m instanceof MatrixD)) {
            throw new UE.UserException("'matrices' <MatrixD> array type mismatch");
          }
          if (m.transposed === true) {
            throw new UE.UserException("'matrices' <MatrixD> construct <MatrixBatchD> shouldn't be transposed");
          }
          if (m.numRow !== this.numRow || m.numCol !== this.numCol) {
            throw new UE.UserException("'matrices''s dimension mismatch");
          }
          this.MatrixDArray.push(m);
          this.elementsArray.push(m.elements);
        }
        this.count = this.elementsArray.length;
        this.batchPointerArray = new JC.BatchPointerArray(this.elementsArray);
      }
    }

    MatrixBatchD.prototype.destroy = function() {
      this.batchPointerArray.destroy();
      this.batchPointerArray = void 0;
      this.numRow = 0;
      this.numCol = 0;
      this.count = 0;
      this.MatrixDArray = void 0;
      this.elementsArray = void 0;
      return void 0;
    };

    MatrixBatchD.prototype.setZero = function() {
      var i, len, m, ref, results;
      ref = this.MatrixDArray;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        m = ref[i];
        results.push(m.setZero());
      }
      return results;
    };

    MatrixBatchD.prototype.T = function() {
      var t;
      t = new MatrixBatchD(this.numCol, this.numRow);
      t.transposed = true;
      t.count = this.MatrixDArray.length;
      t.MatrixDArray = this.MatrixDArray;
      t.elementsArray = this.elementsArray;
      t.batchPointerArray = this.batchPointerArray;
      return t;
    };

    MatrixBatchD.prototype.multiplyMatrixBatch = function(mbb, mcb) {
      var ref;
      if (!(mbb instanceof MatrixBatchD && mcb instanceof MatrixBatchD)) {
        throw new UE.UserException("'mbb, mcb''s  must be MatrixBatchD");
      }
      if ((this.count !== (ref = mbb.count) && ref !== mcb.count)) {
        throw new UE.UserException("'mbb, mcb''s dimension mismatch");
      }
      if (this.numCol !== mbb.numRow || this.numRow !== mcb.numRow || mbb.numCol !== mcb.numCol) {
        throw new UE.UserException("'mbb, mcb''s dimension mismatch");
      }
      JC.matrixMulMatrixBatched(this, mbb, mcb);
      return mcb;
    };

    return MatrixBatchD;

  })();

  module.exports = JC;

  exports = module.exports;

  exports.VectorD = VectorD;

  exports.MatrixD = MatrixD;

  exports.MatrixBatchD = MatrixBatchD;

}).call(this);

//# sourceMappingURL=linear.js.map

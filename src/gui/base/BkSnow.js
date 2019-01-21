/**
 * Created by vinhnq on 12/1/2016.
 */
/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * A fire particle system
 * @class
 * @extends cc.ParticleSystem
 *
 * @example
 * var emitter = new cc.ParticleFire();
 */
cc._RENDER_TYPE_WEBGL = 1;
BkSnow = cc.ParticleSystem.extend(/** @lends cc.ParticleFire# */{
    /**
     * <p>The cc.ParticleFire's constructor. <br/>
     * This function will automatically be invoked when you create a node using new construction: "var node = new cc.ParticleFire()".<br/>
     * Override it to extend its behavior, remember to call "this._super()" in the extended "ctor" function.</p>
     */
    ctor:function () {
        cc.ParticleSystem.prototype.ctor.call(this, (cc._renderType === cc._RENDER_TYPE_WEBGL) ? 700 : 250);
    },

    /**
     * initialize a fire particle system with number Of Particles
     * @param {Number} numberOfParticles
     * @return {Boolean}
     */
    initWithTotalParticles:function (numberOfParticles) {
        if (cc.ParticleSystem.prototype.initWithTotalParticles.call(this, numberOfParticles)) {
            // duration
            this.setDuration(cc.ParticleSystem.DURATION_INFINITY);

            // set gravity mode.
            this.setEmitterMode(cc.ParticleSystem.MODE_GRAVITY);

            // Gravity Mode: gravity
            this.setGravity(cc.p(0, -1));

            // Gravity Mode: speed of particles
            this.setSpeed(1);
            this.setSpeedVar(1);

            // Gravity Mode: radial
            this.setRadialAccel(0);
            this.setRadialAccelVar(1);

            // Gravity mode: tangential
            this.setTangentialAccel(0);
            this.setTangentialAccelVar(1);

            // emitter position
            var winSize = cc.director.getWinSize();
            this.setPosition(winSize.width / 2, winSize.height + 10);
            this.setPosVar(cc.p(winSize.width / 2, 0));

            // angle
            this.setAngle(-90);
            this.setAngleVar(5);

            // life of particles
            this.setLife(50);
            this.setLifeVar(15);

            // size, in pixels
            this.setStartSize(10.0);
            this.setStartSizeVar(8.0);
            this.setEndSize(cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE);

            // emits per second
            this.setEmissionRate(1000);

            // color of particles
            this.setStartColor(cc.color(255, 255, 255, 255));
            this.setStartColorVar(cc.color(0, 0, 0, 0));
            this.setEndColor(cc.color(255, 255, 255, 0));
            this.setEndColorVar(cc.color(0, 0, 0, 0));

            // additive
            this.setBlendAdditive(false);
            return true;
        }
        return false;
    }
});


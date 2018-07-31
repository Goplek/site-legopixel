
import 'mocha';
import 'assert'
import {latte} from "../src/latte";
import { expect } from 'chai';
import _isArray = latte._isArray;
import _camelCase = latte._camelCase;
import _isBoolean = latte._isBoolean;
import _isNumber = latte._isNumber;
import _isNumeric = latte._isNumeric;
import _isString = latte._isString;
import _undef = latte._undef;
import _repeat = latte._repeat;
import _zeroPad = latte._zeroPad;
import _zeroFill = latte._zeroFill;
import log = latte.log;
import sprintf = latte.sprintf;
import Color = latte.Color;
import Eventable = latte.Eventable;
import PropertyTarget = latte.PropertyTarget;
import WillSet = latte.WillSet;
import DidSet = latte.DidSet;
import DateTime = latte.DateTime;
import TimeSpan = latte.TimeSpan;

let randomRange = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;
let randomDate = () => new DateTime(randomRange(2000, 2020), randomRange(1, 12), randomRange(1, 29), randomRange(0, 23), randomRange(0, 59), randomRange(0, 59), randomRange(0, 999));

describe('Global Functions', function () {

    it('_camelCase', () => {

        expect(_camelCase('hello')).to.be.eq('Hello');
        expect(_camelCase('hello world')).to.be.eq('HelloWorld');
        expect(_camelCase('hello_world')).to.be.eq('HelloWorld');
        expect(_camelCase('hello_world_this_is_me')).to.be.eq('HelloWorldThisIsMe');
        expect(_camelCase(null)).to.be.eq('');
        expect(_camelCase('')).to.be.eq('');

    });

    it('_isArray',  () => {
        expect(_isArray('a')).to.be.false;
        expect(_isArray(null)).to.be.false;
        expect(_isArray(undefined)).to.be.false;
        expect(_isArray({})).to.be.false;
        expect(_isArray({length: 90})).to.be.false;
        expect(_isArray(new Int8Array(1))).to.be.false;
        expect(_isArray(new Int32Array(1))).to.be.false;

        expect(_isArray([])).to.be.true;
        expect(_isArray(Array())).to.be.true;
        expect(_isArray(Array(1), 2)).to.be.false;
        expect(_isArray(Array(1), 1)).to.be.true;

    });

    it('_isBoolean', () => {
        expect(_isBoolean(true)).to.be.true;
        expect(_isBoolean(false)).to.be.true;
        expect(_isBoolean(null)).to.be.false;
        expect(_isBoolean(undefined)).to.be.false;
        expect(_isBoolean('')).to.be.false;
        expect(_isBoolean(0)).to.be.false;
        expect(_isBoolean(1)).to.be.false;
        expect(_isBoolean({})).to.be.false;
        expect(_isBoolean([])).to.be.false;
    });

    it('_isNumber', () => {
        expect(_isNumber(0)).to.be.true;
        expect(_isNumber(1)).to.be.true;
        expect(_isNumber(1.1)).to.be.true;
        expect(_isNumber(10E10)).to.be.true;
        expect(_isNumber(Number.MAX_VALUE)).to.be.true;
        expect(_isNumber(Number.MAX_VALUE + 1)).to.be.true;
        expect(_isNumber(NaN)).to.be.true;
        expect(_isNumber(1/0)).to.be.true;
        expect(_isNumber(Infinity)).to.be.true;
        expect(_isNumber('')).to.be.false;
        expect(_isNumber('0')).to.be.false;
        expect(_isNumber('1')).to.be.false;
    });

    it('_isNumeric', () => {
        expect(_isNumeric('0')).to.be.true;
        expect(_isNumeric('100')).to.be.true;
        expect(_isNumeric('100,000')).to.be.false;
        expect(_isNumeric('')).to.be.false;
        expect(_isNumeric(null)).to.be.false;
    });

    it('_isString', () => {
        expect(_isString('')).to.be.true;
        expect(_isString(String(null))).to.be.true;
        expect(_isString(null)).to.be.false;
    });

    it('_isUndef', () => {
        expect(_undef(undefined)).to.be.true;
        expect(_undef(({} as any)['foo'])).to.be.true;
        expect(_undef('')).to.be.false;
    });

    it('_repeat', () => {
        let count1 = 0;
        _repeat(5, () => count1++);
        expect(count1).to.be.equals(5);

        let count2 = 0;
        _repeat(0, () => count2++);
        expect(count2).to.be.equals(0);

        let count3 = 0;
        _repeat(null, () => count3++);
        expect(count3).to.be.equals(0);

    });

    it('_zeroPad', () => {
        expect(_zeroPad(9)).to.be.equals('09');
        expect(_zeroPad(10)).to.be.equals('10');
        expect(_zeroPad(100)).to.be.equals('100');
        expect(_zeroPad(null)).to.be.equals('00');
    });

    it('_zeroFill', () => {
        expect(_zeroFill(2, 9)).to.be.equals('09');
        expect(_zeroFill(3, 9)).to.be.equals('009');
        expect(_zeroFill(3, 100)).to.be.equals('100');
        expect(_zeroFill(5, 100)).to.be.equals('00100');
        expect(_zeroFill(2, 1000000)).to.be.equals('1000000');
    });

    it('log', () => {
        expect(log('hi')).to.be.undefined;
        expect(log('hi', 'this', 'is', 'me')).to.be.undefined;
    });

    it('sprintf', () => {
        expect(sprintf('%s', 'a')).to.be.equals('a');
        expect(sprintf('hi %s', 'you')).to.be.equals('hi you');
        expect(sprintf('100% %s', 'sure')).to.be.equals('100% sure');
        expect(sprintf('%s%', 100)).to.be.equals('100%');
    });

});

describe('Eventable', function(){

    it('should trigger only once', function () {
        let e = new Eventable();
        let flag = 0;
        let name = 'something';
        let f = () => flag++;
        e.on(name, f);
        e.raise(name);
        expect(flag).to.be.equals(1);
    });

    it('should trigger three times', function () {
        let e = new Eventable();
        let flag = 0;
        let name = 'something';
        let f = () => flag++;
        e.on(name, f);
        e.on(name, f);
        e.on(name, f);
        e.raise(name);
        expect(flag).to.be.equals(3);
    });

});

describe('PropertyTarget', function(){

    it('should get & set properties', function () {

        class a extends PropertyTarget{

            static get someStatic(): string {
                return PropertyTarget.getStaticPropertyValue(a, 'someStatic', 'sdef');
            }

            static set someStatic(value: string) {
                PropertyTarget.setStaticPropertyValue(a, 'someStatic', value);
            }

            static get hasSomeStatic(): boolean {
                return PropertyTarget.hasStaticPropertyValue(a, 'someStatic');
            }

            get hasName(): boolean {
                return this.hasPropertyValue('name');
            }

            get name(): string {
                return this.getPropertyValue('name', 'defname');
            }

            set name(value: string) {
                this.setPropertyValue('name', value);
            }

            setValues(s: string){
                this.setPropertyValues({
                    'name': s
                });
            }

        }

        expect(a.hasSomeStatic).to.be.false;

        expect(a.someStatic).to.be.equals('sdef');

        a.someStatic = 'abc';

        expect(a.someStatic).to.be.equals('abc');
        expect(a.someStatic).to.be.equals('abc');

        let p = new a();

        expect(p.hasName).to.be.false;

        expect(p.name).to.be.equals('defname');

        p.name = 'joe';

        expect(p.name).to.be.equals('joe');

        p.setValues('doe');

        expect(p.name).to.be.equals('doe');

    });

    it('should trigger willSet & didSet', function () {

        class A extends PropertyTarget{

            public willSetCall: DateTime = null;
            public didSetCall: DateTime = null;

            didSet(e: DidSet){
                super.didSet(e);

                if (e.property == 'name'){
                    this.didSetCall = DateTime.now;
                }

            }

            willSet(e: WillSet){
                super.willSet(e);

                if (e.property == 'name'){
                    this.willSetCall = DateTime.now;
                    e.newValue = 'fixed';
                }

            }

            get name(): string {
                return this.getPropertyValue('name', 'defname');
            }

            set name(value: string) {
                this.setPropertyValue('name', value);
            }

        }

        let a = new A();
        let willFlag = false;
        let willValue = '';
        let didFlag = false;
        let didValue = '';

        a.on('willSetName', (w: WillSet) => {
            willFlag = true;
            if(!willValue) willValue = w.newValue;
        });
        a.on('didSetName', (d: DidSet) => {
            didFlag = true;
            didValue = d.newValue;
        });

        expect(a.name).to.be.equals('defname');

        a.name = 'john';

        expect(a.name).to.be.equals('fixed');
        expect(willFlag).to.be.true;
        expect(didFlag).to.be.true;
        expect(willValue).to.be.equals('john');
        expect(didValue).to.be.equals('fixed');

    });

});

describe('Color', function () {

    it('should combine', function () {
        let c = Color.combine(Color.black, Color.white);
        expect(c.r).to.be.equals(128);
        expect(c.g).to.be.equals(128);
        expect(c.b).to.be.equals(128);
    });

    it('should fromHex', function () {
        expect(Color.fromHex('000').equals(Color.black)).to.be.true;
        expect(Color.fromHex('fff').equals(Color.white)).to.be.true;
        expect(Color.fromHex('f00').equals(Color.red)).to.be.true;
        expect(Color.fromHex('00f').equals(Color.blue)).to.be.true;

        expect(Color.fromHex('000000').equals(Color.black)).to.be.true;
        expect(Color.fromHex('0000ff').equals(Color.blue)).to.be.true;

        expect(Color.fromHex('#ffffff').equals(Color.white)).to.be.true;
        expect(Color.fromHex('#FFFFFF').equals(Color.white)).to.be.true;
        expect(Color.fromHex('#FFffFF').equals(Color.white)).to.be.true;
        expect(Color.fromHex('#fFfFfF').equals(Color.white)).to.be.true;
        expect(Color.fromHex('#0000ff').equals(Color.blue)).to.be.true;
        expect(Color.fromHex('#00000000').equals(Color.transparent)).to.be.true;

        expect(() => Color.fromHex('090909090909090')).to.throw();
        expect(() => Color.fromHex(1 as any)).to.throw();

    });

    it('should from and to Int32', function () {

        _repeat(100, () => {
            let r = randomRange(0, 255);
            let g = randomRange(0, 255);
            let b = randomRange(0, 255);
            let a = randomRange(0, 255);
            let color = new Color(r, g, b, a);
            let int32 = color.toInt32();
            let from = Color.fromInt32(int32);

            expect(from.r).to.be.equals(r);
            expect(from.g).to.be.equals(g);
            expect(from.b).to.be.equals(b);
            expect(from.a).to.be.equals(a);
        });

    });

    it('should cmykToRgb', function () {
        expect(Color.cmykToRgb(1, .25, 0, 0)).to.deep.equal([0, 191, 255]);
    });

    it('should hsvToRgb', function () {
        expect(Color.hsvToRgb(240, 1, 1)).to.deep.equal([0, 0, 255]);
        expect(Color.hsvToRgb(0, 0, 0)).to.deep.equal([0, 0, 0]);
        expect(Color.hsvToRgb(1, 1, 0)).to.deep.equal([0, 0, 0]);
        expect(Color.hsvToRgb(91, 1, 0)).to.deep.equal([0, 0, 0]);
        expect(Color.hsvToRgb(130, 1, 0)).to.deep.equal([0, 0, 0]);
        expect(Color.hsvToRgb(181, 1, 0)).to.deep.equal([0, 0, 0]);
        expect(Color.hsvToRgb(300, 1, 0)).to.deep.equal([0, 0, 0]);
    });

    it('should rgbToCmyk', function () {
        expect(Color.rgbToCmyk(0, 191, 255).map(i => parseFloat(i.toFixed(2))))
            .to.deep.equal([1, .25, 0, 0]);
    });

    it('should rgbToHsv', function () {
        expect(Color.rgbToHsv(0, 0, 255)).to.deep.equal([240, 1, 1]);
        expect(Color.rgbToHsv(255, 255, 255)).to.deep.equal([0, 0, 1]);
        expect(Color.rgbToHsv(255, 0, 0)).to.deep.equal([0, 1, 1]);
        expect(Color.rgbToHsv(0, 255, 0)).to.deep.equal([120, 1, 1]);
        expect(Color.rgbToHsv(0, 0, 0)).to.deep.equal([0, 0, 0]);
    });

    it('should standard colors', function () {
        expect(Color.black.toHexString()).to.be.equals('#000000');
        expect(Color.white.toHexString()).to.be.equals('#ffffff');
        expect(Color.red.toHexString()).to.be.equals('#ff0000');
        expect(Color.green.toHexString()).to.be.equals('#008000');
        expect(Color.blue.toHexString()).to.be.equals('#0000ff');
        expect(Color.transparent.toHexString()).to.be.equals('#00000000');
    });

    it('should construct', () => {
        let c = new Color(255, 255, 255);
        expect(c.r).to.be.equals(255);
        expect(c.g).to.be.equals(255);
        expect(c.b).to.be.equals(255);
    });

    it('should equals', function () {
        expect(Color.black.equals(Color.black)).to.be.true;
        expect(Color.white.equals(Color.white)).to.be.true;
        expect(Color.transparent.equals(Color.transparent)).to.be.true;
        expect(Color.black.equals(Color.transparent)).to.be.false;
        expect(new Color().equals(Color.transparent)).to.be.false;
        expect(new Color().equals(Color.black)).to.be.true;

    });

    it('should toHex', function () {
        expect(Color.white.toHexString()).to.be.equals('#ffffff');
        expect(Color.red.toHexString()).to.be.equals('#ff0000');
    });

    it('should toString', function () {
        expect(Color.transparent.toString()).to.be.equals('transparent');
        expect(Color.red.fade(100).toString()).to.be.equals('rgba(255, 0, 0, 100)');
        expect(Color.red.toString()).to.be.equals('#ff0000');
    });

    it('should toRgbString', function () {
        expect(Color.black.toRgbString()).to.be.equals('rgba(0, 0, 0, 255)');
        expect(Color.transparent.toRgbString()).to.be.equals('rgba(0, 0, 0, 0)');
        expect(Color.white.toRgbString()).to.be.equals('rgba(255, 255, 255, 255)');
    });

    it('should cymk properties', function () {
        let deepSkyBlue = new Color(0, 191, 255);
        expect(deepSkyBlue.c).to.be.equals(1);
        expect(parseFloat(deepSkyBlue.m.toFixed(2))).to.be.equals(.25);
        expect(deepSkyBlue.y).to.be.equals(0);
        expect(deepSkyBlue.k).to.be.equals(0);

        let orange = Color.fromHex('ff9933');
        expect(orange.c).to.be.equals(0);
        expect(parseFloat(orange.m.toFixed(1))).to.be.equals(.4);
        expect(parseFloat(orange.y.toFixed(1))).to.be.equals(.8);
        expect(orange.k).to.be.equals(0);

        let dark = Color.fromHex('1a0d00');
        expect(dark.c).to.be.equals(0);
        expect(parseFloat(dark.m.toFixed(1))).to.be.equals(.5);
        expect(dark.y).to.be.equals(1);
        expect(parseFloat(dark.k.toFixed(1))).to.be.equals(.9);
    });

    it('should percievedLuminosity', function () {
        expect(Color.black.isDark).to.be.true;
        expect(Color.white.isLight).to.be.true;
        expect(Color.red.isDark).to.be.true;
        expect(Color.black.perceivedLuminosity).to.be.equals(1);
        expect(Color.white.perceivedLuminosity).to.be.equals(0);
    });

    it('should fade', function () {
        expect(Color.black.fade(100).a).to.be.equals(100);
        expect(Color.black.fadeFloat(0.5).a).to.be.equals(127.5);
    });

});

describe('TimeSpan', function(){

    let epoch = () => new Date().getTime();
    let fromEpoch = (e: number) => DateTime.fromMilliseconds(e);
    let stringRepresentations: {[s: string]: number} =  {
        '01:00:00':     60 * 60 * 1000,
        '1 00:00:00':   24 * 60 * 60 * 1000,
        '00:01:00':     60 * 1000,
        '00:00:01':     1000
    };

    it('should manufacture', function () {
        expect(TimeSpan.fromDays(1).totalMilliseconds).to.be.equals(24 * 60 * 60 * 1000);
        expect(TimeSpan.fromHours(1).totalMilliseconds).to.be.equals(60 * 60 * 1000);
        expect(TimeSpan.fromMinutes(1).totalMilliseconds).to.be.equals(60 * 1000);
        expect(TimeSpan.fromSeconds(1).totalMilliseconds).to.be.equals(1000);
        expect(TimeSpan.fromMilliseconds(1).totalMilliseconds).to.be.equals(1);

        expect(TimeSpan.fromDays(-1).totalMilliseconds).to.be.equals(-24 * 60 * 60 * 1000);
        expect(TimeSpan.fromHours(-1).totalMilliseconds).to.be.equals(-60 * 60 * 1000);
        expect(TimeSpan.fromMinutes(-1).totalMilliseconds).to.be.equals(-60 * 1000);
        expect(TimeSpan.fromSeconds(-1).totalMilliseconds).to.be.equals(-1000);
        expect(TimeSpan.fromMilliseconds(-1).totalMilliseconds).to.be.equals(-1);
    });

    it('should create from string', function () {
        for(let s in stringRepresentations)
            expect(TimeSpan.fromString(s).totalMilliseconds).to.be.equals(stringRepresentations[s]);

        expect(TimeSpan.fromString('00:00:01.1'  ).totalMilliseconds).to.be.equals(1100);

        expect(() => TimeSpan.fromString('5 5 01:00:00')).to.throw();
        expect(() => TimeSpan.fromString('01:00'      )).to.throw();
        expect(() => TimeSpan.fromString('00:00:01:00')).to.throw();
        expect(() => TimeSpan.fromString('0000'       )).to.throw();
        expect(() => TimeSpan.fromString('00:00:1.9.9')).to.throw();

    });

    it('should create negatives from string', function () {
        expect(TimeSpan.fromString('-00:00:01'        ).totalSeconds).to.be.equals(-1);
        expect(() => TimeSpan.fromString('00:00:-01'  )).to.throw();
    });

    it('should create with time since', function () {
        expect(TimeSpan.timeSince(DateTime.now).totalSeconds).to.be.equals(0);
    });

    it('should subtract time since', function () {
        expect(epoch() - epoch()).to.be.below(3);
        // expect(TimeSpan.timeSince(fromEpoch(epoch())).toString()).to.be.ab(1000);
    });

    it('should construct', function () {
        expect(new TimeSpan().totalMilliseconds).to.be.equals(0);
        expect(new TimeSpan(1).totalMilliseconds).to.be.equals(24 * 60 * 60 * 1000);
        expect(new TimeSpan(0, 1).totalMilliseconds).to.be.equals(60 * 60 * 1000);
        expect(new TimeSpan(0, 0, 1).totalMilliseconds).to.be.equals(60 * 1000);
        expect(new TimeSpan(0, 0, 0, 1).totalMilliseconds).to.be.equals(1000);
        expect(new TimeSpan(0, 0, 0, 0, 1).totalMilliseconds).to.be.equals(1);
        expect(() => new TimeSpan(-1)).to.throw();
    });

    it('should add', function () {
        expect(new TimeSpan().add(new TimeSpan()).totalMilliseconds).to.be.equals(0);
        expect(new TimeSpan(1).add(new TimeSpan(1)).totalMilliseconds).to.be.equals(
            2 * 24 * 60 * 60 * 1000
        );
        expect(new TimeSpan(0,0,0,0,1)
            .add(new TimeSpan(0,0,0,0,1)).totalMilliseconds)
            .to.be.equals(2);
        expect(new TimeSpan(0,0,0,0, 1)
            .addHours(1).totalMilliseconds).to.be.equals(60 * 60 * 1000 + 1);
        expect(new TimeSpan(0,0,0,0, 1)
            .addMinutes(1).totalMilliseconds).to.be.equals(60 * 1000 + 1);
        expect(new TimeSpan(0,0,0,0, 1)
            .addSeconds(1).totalMilliseconds).to.be.equals(1000 + 1);
    });

    it('should compare', function () {
        expect(TimeSpan.fromMilliseconds(1).compareTo(TimeSpan.fromMilliseconds(2)))
            .to.be.below(0);
        expect(TimeSpan.fromMilliseconds(2).compareTo(TimeSpan.fromMilliseconds(1)))
            .to.be.above(0);
        expect(TimeSpan.fromMilliseconds(1).compareTo(TimeSpan.fromMilliseconds(1)))
            .to.be.equals(0);
    });

    it('should assert equals', function () {
        expect(new TimeSpan().equals(new TimeSpan())).to.be.true;
        expect(new TimeSpan(1).equals(new TimeSpan(1))).to.be.true;
        expect(new TimeSpan(1).equals(TimeSpan.fromDays(1))).to.be.true;
        expect(new TimeSpan(1).equals(TimeSpan.fromHours(24))).to.be.true;
    });

    it('should negate', function () {
        expect(new TimeSpan().negate().totalMilliseconds).to.be.equals(0);
        expect(new TimeSpan(0,0,0,0,1).negate().totalMilliseconds).to.be.equals(-1);
    });

    it('should subtract', function () {
        expect(new TimeSpan().subtract(new TimeSpan()).totalMilliseconds).to.be.equals(0);
        expect(TimeSpan.fromDays(1).subtract(TimeSpan.fromDays(1)).totalMilliseconds).to.be.equals(0);
    });

    it('should toString', function () {
        for(let s in stringRepresentations){
            expect(TimeSpan.fromMilliseconds(stringRepresentations[s]).toString()).to.be.equals(s);
        }

        expect(TimeSpan.fromSeconds(-1).toString()).to.be.equals('-00:00:01');
        expect(new TimeSpan(1, 1, 1,1, 1).negate().toString()).to.be.equals('-1 01:01:01');
    });

    it('should operate valueOf', function () {
        expect(TimeSpan.fromMilliseconds(12345).valueOf()).to.be.equals(12345);
        expect(TimeSpan.fromMilliseconds(1) as any + TimeSpan.fromMilliseconds(1)).to.be.equals(2);
        expect(TimeSpan.fromMilliseconds(1) as any + TimeSpan.fromMilliseconds(-1)).to.be.equals(0);
        expect((TimeSpan.fromMilliseconds(2) as any) * (TimeSpan.fromMilliseconds(4) as any)).to.be.equals(8);
    });

    it('should tell if empty', function () {
        expect(new TimeSpan().isEmpty).to.be.true;
        expect(new TimeSpan(null).isEmpty).to.be.true;
        expect(new TimeSpan(1).isEmpty).to.be.false;


    });

    it('should handle days & totalDays props', function () {

        // Happy paths
        expect(TimeSpan.fromDays(1).days).to.be.equals(1);
        expect(TimeSpan.fromDays(1).totalDays).to.be.equals(1);
        expect(TimeSpan.fromHours(24).days).to.be.equals(1);
        expect(TimeSpan.fromHours(24).totalDays).to.be.equals(1);
        expect(TimeSpan.fromMinutes(24 * 60).days).to.be.equals(1);
        expect(TimeSpan.fromMinutes(24 * 60).totalDays).to.be.equals(1);
        expect(TimeSpan.fromSeconds(24 * 60 * 60).days).to.be.equals(1);
        expect(TimeSpan.fromSeconds(24 * 60 * 60).totalDays).to.be.equals(1);
        expect(TimeSpan.fromMilliseconds(24 * 60 * 60 * 1000).days).to.be.equals(1);
        expect(TimeSpan.fromMilliseconds(24 * 60 * 60 * 1000).totalDays).to.be.equals(1);

        expect(TimeSpan.fromDays(0.5).totalHours).to.be.equals(12);
        expect(new TimeSpan(5, 1, 1, 1, 1).days).to.be.equals(5);
        expect(new TimeSpan(5, 1, 1, 1, 1).totalDays).to.be.above(5);


    });

    it('should handle hours & totalHours props', function () {

        // Happy paths
        expect(TimeSpan.fromHours(1).hours).to.be.equals(1);
        expect(TimeSpan.fromDays(1).totalHours).to.be.equals(24);
        // expect(TimeSpan.fromHours(24).hours).to.be.equals(24);
        expect(TimeSpan.fromHours(24).totalHours).to.be.equals(24);
        // expect(TimeSpan.fromMinutes(24 * 60).hours).to.be.equals(24);
        expect(TimeSpan.fromMinutes(24 * 60).totalHours).to.be.equals(24);
        // expect(TimeSpan.fromSeconds(24 * 60 * 60).hours).to.be.equals(24);
        expect(TimeSpan.fromSeconds(24 * 60 * 60).totalHours).to.be.equals(24);
        // expect(TimeSpan.fromMilliseconds(24 * 60 * 60 * 1000).hours).to.be.equals(24);
        expect(TimeSpan.fromMilliseconds(24 * 60 * 60 * 1000).totalHours).to.be.equals(24);

        expect(TimeSpan.fromDays(0.5).totalHours).to.be.equals(12);
        expect(new TimeSpan(5, 1, 1, 1, 1).days).to.be.equals(5);
        expect(new TimeSpan(5, 1, 1, 1, 1).totalDays).to.be.above(5);

    });

    it('should handle minutes & totalMinutes props', function () {
        expect(TimeSpan.fromMinutes(1).minutes).to.be.equals(1);
        expect(TimeSpan.fromMinutes(1).totalMinutes).to.be.equals(1);
    });

    it('should handle seconds & totalSeconds props', function () {
        expect(TimeSpan.fromSeconds(1).seconds).to.be.equals(1);
        expect(TimeSpan.fromSeconds(1).totalSeconds).to.be.equals(1);
    });

    it('should handle milliseconds & totalMilliseconds props', function () {
        expect(TimeSpan.fromMilliseconds(1).milliseconds).to.be.equals(1);
        expect(TimeSpan.fromMilliseconds(1).totalMilliseconds).to.be.equals(1);
    });

});

describe('DateTime', function () {

    it('should respect max', function () {

        let max = DateTime.MAX_VALUE;

        expect(DateTime.MAX_VALUE.toMilliseconds()).to.be.equals((Number as any).MAX_SAFE_INTEGER);
        // expect(DateTime.fromMilliseconds(9007199254740991).toMilliseconds()).to.be.equals(9007199254740991);
    });

    it('should tell absolute days of year', function () {

        expect(DateTime.absoluteDays(1, 1, 1)).to.be.equals(0);
        expect(DateTime.absoluteDays(4, 1, 1)).to.be.equals(365 * 3);
        expect(DateTime.absoluteDays(4, 3, 1)).to.be.equals(365 * 3 + 31 + 29);

    });

    it('should tell days in month', function () {

        expect(DateTime.daysInMonth(2000, 1)).to.be.equals(31);
        expect(DateTime.daysInMonth(2000, 2)).to.be.equals(29);
        expect(DateTime.daysInMonth(2000, 3)).to.be.equals(31);
        expect(DateTime.daysInMonth(2000, 4)).to.be.equals(30);
        expect(DateTime.daysInMonth(2000, 5)).to.be.equals(31);
        expect(DateTime.daysInMonth(2000, 6)).to.be.equals(30);
        expect(DateTime.daysInMonth(2000, 7)).to.be.equals(31);
        expect(DateTime.daysInMonth(2000, 8)).to.be.equals(31);
        expect(DateTime.daysInMonth(2000, 9)).to.be.equals(30);
        expect(DateTime.daysInMonth(2000, 10)).to.be.equals(31);
        expect(DateTime.daysInMonth(2000, 11)).to.be.equals(30);
        expect(DateTime.daysInMonth(2000, 12)).to.be.equals(31);

        expect(DateTime.daysInMonth(2001, 1)).to.be.equals(31);
        expect(DateTime.daysInMonth(2001, 2)).to.be.equals(28);
        expect(DateTime.daysInMonth(2001, 3)).to.be.equals(31);
        expect(DateTime.daysInMonth(2001, 4)).to.be.equals(30);
        expect(DateTime.daysInMonth(2001, 5)).to.be.equals(31);
        expect(DateTime.daysInMonth(2001, 6)).to.be.equals(30);
        expect(DateTime.daysInMonth(2001, 7)).to.be.equals(31);
        expect(DateTime.daysInMonth(2001, 8)).to.be.equals(31);
        expect(DateTime.daysInMonth(2001, 9)).to.be.equals(30);
        expect(DateTime.daysInMonth(2001, 10)).to.be.equals(31);
        expect(DateTime.daysInMonth(2001, 11)).to.be.equals(30);
        expect(DateTime.daysInMonth(2001, 12)).to.be.equals(31);

    });

    it('should create from date and time components', function () {

        expect(DateTime.fromDateAndTime(DateTime.now, new TimeSpan()).equals(DateTime.today)).to.be.true;

    });

    it('should create from milliseconds', function () {
        expect(DateTime.fromMilliseconds(0)._span.totalMilliseconds).to.be.equals(0);
    });

    it('should create from string', function () {

        let base = DateTime.fromString('1-1-1 00:00:00');
        let timed = DateTime.fromString('1-1-1');

        expect(base.day).to.be.equals(1);
        expect(base.month).to.be.equals(1);
        expect(base.year).to.be.equals(1);

        expect(base.hour).to.be.equals(0);
        expect(base.minute).to.be.equals(0);
        expect(base.second).to.be.equals(0);

        expect(timed.hour).to.be.equals(0);
        expect(timed.minute).to.be.equals(0);
        expect(timed.second).to.be.equals(0);

        expect(() => DateTime.fromString('0-0-0')).to.throw();
        expect(() => DateTime.fromString('1-1-1-1-1')).to.throw();

    });

    it('should tell if is leap year', function () {

        expect(DateTime.isLeapYear(2000)).to.be.true;
        expect(DateTime.isLeapYear(2001)).to.be.false;
        expect(DateTime.isLeapYear(2002)).to.be.false;
        expect(DateTime.isLeapYear(2003)).to.be.false;
        expect(DateTime.isLeapYear(2004)).to.be.true;

    });

    it('should return now', function () {

        let nowA = TimeSpan.timeSince(new DateTime(1970, 1, 1));
        let offset = new Date().getTimezoneOffset() * 60 * 1000;
        let nowB = Date.now();

        expect(nowA.totalMilliseconds).to.be.equals(nowB - offset);

    });

    it('should return now today, tomorrow, yesterday', function () {
        let dayMillis = 24 * 60 * 60 * 1000;
        let now = DateTime.now;
        let today = DateTime.today;
        let tomorrow = DateTime.tomorrow.toMilliseconds();
        let yesterday = DateTime.yesterday.toMilliseconds();

        expect(today.year).to.be.equals(now.year);
        expect(today.month).to.be.equals(now.month);
        expect(today.day).to.be.equals(now.day);
        expect(today.hour).to.be.equals(0);
        expect(today.minute).to.be.equals(0);
        expect(today.second).to.be.equals(0);
        expect(today.millisecond).to.be.equals(0);

        expect(tomorrow).to.be.equals(today.toMilliseconds() + dayMillis);
        expect(yesterday).to.be.equals(today.toMilliseconds() - dayMillis);

    });

    it('should return unix epoch', function () {
        expect(DateTime.epoch.year).to.be.equals(1970);
        expect(DateTime.epoch.month).to.be.equals(1);
        expect(DateTime.epoch.day).to.be.equals(1);
    });

    it('should construct', function () {

        expect(() => new DateTime(0, 1, 1)).to.throw();

    });

    it('should add', function () {

        let start = new DateTime(1, 1, 1);

        expect(start
            .add(TimeSpan.fromMilliseconds(1))
            .toMilliseconds())
            .to.be.equals(1);

        expect(start
            .addDays(1)
            .toMilliseconds())
            .to.be.equals(24 * 60 * 60 * 1000);

        expect(start
            .addHours(1)
            .toMilliseconds())
            .to.be.equals(60 * 60 * 1000);

        expect(start
            .addMinutes(1)
            .toMilliseconds())
            .to.be.equals(60 * 1000);

        expect(start
            .addSeconds(1)
            .toMilliseconds())
            .to.be.equals(1000);

        expect(start
            .addMilliseconds(1)
            .toMilliseconds())
            .to.be.equals(1);

        expect(start
            .addMonths(1)
            .toMilliseconds())
            .to.be.equals(31 * 24 * 60 * 60 * 1000);

        expect(start
            .addYears(1)
            .toMilliseconds())
            .to.be.equals(365 * 24 * 60 * 60 * 1000);

    });

    it('should compare', function () {
        expect(DateTime.fromMilliseconds(1).compareTo(
            DateTime.fromMilliseconds(2)
        )).to.be.below(0);

        let millis = Math.round(Math.abs(Math.random() * 1234567890));

        expect(DateTime.fromMilliseconds(millis).equals(
            new DateTime(1,1,1,0,0,0, millis)
        )).to.be.true;
    });

    it('should tell onRange', function () {
        // a-----b-----c
        let a = new DateTime(1, 1, 1);
        let b = new DateTime(1, 1, 2);
        let c = new DateTime(1, 1, 3);

        expect(b.onRange(a, b)).to.be.true;
        expect(a.onRange(b, c)).to.be.false;
        expect(c.onRange(a, c)).to.be.true;
    });

    it('should subtract', function () {

        expect(new DateTime(1,1,2)
            .subtractDate(new DateTime(1, 1, 1))
            .equals(TimeSpan.fromDays(1))).to.be.true;

        expect(new DateTime(1,1,2)
            .subtractTime(TimeSpan.fromDays(1))
            .equals(new DateTime(1, 1, 1))).to.be.true;

    });

    it('should toString and valueOf', function () {

        let dates = [
            '2000-01-01 00:00:00',
            '1-01-01 00:05:00',
            '3000-01-01 00:05:00',
        ];

        dates.forEach(d => expect(DateTime.fromString(d).toString()).to.be.equals(d));


    });

    it('should tell individual parts', function () {

        _repeat(100, () => {
            let year = randomRange(1950, 2020),
                month = randomRange(1, 12),
                day = randomRange(1, 29),
                hour = randomRange(0, 23),
                minute = randomRange(0, 59),
                second = randomRange(0, 59),
                milli = randomRange(0, 999);
            let d = new DateTime(year, month, day, hour, minute, second, milli);

            expect(d.year).to.be.equals(year);
            expect(d.month).to.be.equals(month);
            expect(d.day).to.be.equals(day);
            expect(d.hour).to.be.equals(hour);
            expect(d.minute).to.be.equals(minute);
            expect(d.second).to.be.equals(second);
            expect(d.millisecond).to.be.equals(milli);
            expect(d.timeOfDay.equals(new TimeSpan(0, hour, minute, second, milli))).to.be.true;

            if(DateTime.epoch.compareTo(DateTime.epoch) > 0) {
                expect(d.thisEpoch).to.be.false;
            }else{
                expect(d.thisEpoch).to.be.true;
            }

        });

        expect(new DateTime(2000, 1, 1).weekOfYear).to.be.equals(1);
        expect(new DateTime(2001, 12, 31).weekOfYear).to.be.equals(53);

        expect(new DateTime(2000, 1, 1).dayOfYear).to.be.equals(1);
        expect(new DateTime(2000, 12, 31).dayOfYear).to.be.equals(366);
        expect(new DateTime(2001, 1, 1).dayOfYear).to.be.equals(1);
        expect(new DateTime(2001, 12, 31).dayOfYear).to.be.equals(365);

    });

});
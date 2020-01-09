import { ui } from '../src/ui';
import { expect } from 'chai';
import 'mocha';
import Element = ui.Element;
import Animation = ui.Animation;
import {latte} from "../src/latte";
import _repeat = latte._repeat;
import DateTime = latte.DateTime;
import UiElement = ui.UiElement;
import LanguageDirection = ui.LanguageDirection;
import DivElement = ui.DivElement;
import Label = ui.Label;
import Optional = latte.Optional;
import Icon = ui.Icon;


let randomRange = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;
let randomChar = () => String.fromCharCode(randomRange(97, 122));
let randomString = (len: number = 10) => (new Array(len) as any).fill('').reduce((a:string) => a + randomChar());

describe('Animation', () => {


    it('should scroll an int', function () {
        let a = new Animation(0, 10, 10);

        expect(a.getValueForSecond(0)).to.be.equals(0);
        expect(a.getValueForSecond(1)).to.be.equals(1);
        expect(a.getValueForSecond(2)).to.be.equals(2);
        expect(a.getValueForSecond(3)).to.be.equals(3);
        expect(a.getValueForSecond(4)).to.be.equals(4);
        expect(a.getValueForSecond(5)).to.be.equals(5);
        expect(a.getValueForSecond(6)).to.be.equals(6);
        expect(a.getValueForSecond(7)).to.be.equals(7);
        expect(a.getValueForSecond(8)).to.be.equals(8);
        expect(a.getValueForSecond(9)).to.be.equals(9);
        expect(a.getValueForSecond(10)).to.be.equals(10);
        expect(a.getValueForSecond(11)).to.be.equals(11);

    });

    it('should scroll an int throw a clock', function () {
        // Lets try to drag an int value from 0 to 10 in 10 steps
        let theValue = 0;
        let a = new Animation(0, 10, 10);
        let clock = DateTime.MIN_VALUE;
        let checks: number[] = [];
        let second = 0;

        // This supplies a clock to the animator
        a.nowSupplier = () => clock;

        // Set the start date to the clock
        a.updateStartDate();

        _repeat(10, () => {

            // Get current value
            let cur = a.currentValue;

            // Add value to check list
            checks.push(cur);

            // Assert
            expect(cur).to.be.equals(second);

            // Increment clock;
            clock = clock.addSeconds(1);

            second++;

        });

    });


});

describe('Element', () => {

    let tags = ('a,abbr,acronym,address,applet,area,article,aside,audio,base,basefont,bdo,bgsound,blink,blockquote,' +
        'body,br,button,canvas,caption,center,col, colgroup,command,comment,datalist,dd,del,details,dir,div,dl,dt,' +
        'embed,fieldset,figure,b,big,i,small,tt,font,footer,form,frame,frameset,head,header,hgroup,h1,hr,html,' +
        'isindex,iframe,ilayer,img,input,ins,keygen,keygen,label,layer,legend,li,link,map, mark,marquee,menu,meta,' +
        'meter,multicol,nav,nobr,noembed,noframes,noscript,object,ol,optgroup,option,output,p,param,cite,code,dfn,em,' +
        'kbd,samp,strong,var,plaintext,pre,progress,q,ruby,script,section,select,spacer,span,s,strike,style,sub,sup,' +
        'table,tbody,td,textarea,tfoot,th,thead,time,title,tr,u,ul,video,wbr,wbr,xmp').split(',');
    let randomTagName = () => tags[randomRange(1, tags.length - 1)];
    let randomTag = () => document.createElement(randomTagName());
    let randomElement = () => new Element(randomTag());

    it('should create', () => {

        let div = document.createElement('div');
        let ediv = new Element<HTMLDivElement>(div);

        // Fresh from the oven
        expect(ediv.raw instanceof HTMLDivElement).to.be.true;

        expect(Element.of('div').raw instanceof HTMLDivElement).to.be.true;
        expect(Element.of('p').raw instanceof HTMLParagraphElement).to.be.true;
        expect(Element.of('input').raw instanceof HTMLInputElement).to.be.true;

        // Constructor always expects an element
        expect(() => new Element<HTMLElement>(null)).to.throw();
        expect(() => new Element<HTMLElement>(1 as any)).to.throw();
        expect(() => new Element<HTMLElement>([] as any)).to.throw();
        expect(() => new Element<HTMLElement>({} as any)).to.throw();

    });

    it('should handle style classes', function () {

        let d = Element.of('div');
        d.addClass('a b c');

        expect(d.hasClass('a')).to.be.true;
        expect(d.hasClass('b')).to.be.true;
        expect(d.hasClass('c')).to.be.true;
        expect(d.hasClass('d')).to.be.false;

        d.removeClass('c');

        expect(d.hasClass('a')).to.be.true;
        expect(d.hasClass('b')).to.be.true;
        expect(d.hasClass('c')).to.be.false;
        expect(d.hasClass('d')).to.be.false;

        d.removeClass('b');

        expect(d.hasClass('a')).to.be.true;
        expect(d.hasClass('b')).to.be.false;
        expect(d.hasClass('c')).to.be.false;
        expect(d.hasClass('d')).to.be.false;

        d.addClass('d');

        expect(d.hasClass('a')).to.be.true;
        expect(d.hasClass('b')).to.be.false;
        expect(d.hasClass('c')).to.be.false;
        expect(d.hasClass('d')).to.be.true;

        d.removeClass('a');

        expect(d.hasClass('a')).to.be.false;
        expect(d.hasClass('b')).to.be.false;
        expect(d.hasClass('c')).to.be.false;
        expect(d.hasClass('d')).to.be.true;

        _repeat(100, () => {

            let must = Math.random() > 0.5;
            let name = 'a' + String(Math.round(Math.random() * 10000));
            let e = Element.of('p');

            e.ensureClass(name, must);

            expect(e.hasClass(name)).to.be.equals(must);

        });

    });

    it('should add, attachTo, remove', function () {

        let a = Element.of('div');
        let b = Element.of('div');

        b.attachTo(a);
        a.attachTo(document.body);

        expect(b.raw.parentElement).to.be.equals(a.raw);
        expect(a.raw.parentElement).to.be.equals(document.body);
        expect(b.raw.parentElement).to.be.not.equals(document.body);

        b.removeFromParent();

        expect(b.raw.parentElement).to.be.not.equals(a.raw);
        expect(a.raw.parentElement).to.be.equals(document.body);
        expect(b.raw.parentElement).to.be.not.equals(document.body);

        a.removeFromParent();

        expect(b.raw.parentElement).to.be.not.equals(a.raw);
        expect(a.raw.parentElement).to.be.not.equals(document.body);
        expect(b.raw.parentElement).to.be.not.equals(document.body);

        let c = Element.of('div');
        let d = Element.of('div');
        let e = Element.of('div');
        let f = [
            Element.of('div'),
            Element.of('div'),
            Element.of('div'),
            Element.of('div'),
        ];

        c.add(d);       // Just an Element
        c.add(e.raw);   // Just an HTMLElement
        c.add(f);       // Array of Element

        expect(c.raw.contains(d.raw)).to.be.true;
        expect(c.raw.contains(e.raw)).to.be.true;
        expect(c.raw.contains(f[0].raw)).to.be.true;
        expect(c.raw.contains(f[1].raw)).to.be.true;
        expect(c.raw.contains(f[2].raw)).to.be.true;
        expect(c.raw.contains(f[3].raw)).to.be.true;

    });

    it('should manage attributes', function () {

        _repeat(10, () => {

            let a = randomElement();
            let atts:{[a: string]: string} = {};

            _repeat( randomRange(1, 10), () => {

                let name = randomString();
                let value = randomString(30);

                a.setAtt(name, value);

                atts[name] = value;

                expect(a.getAtt(name)).to.be.equals(value);

            });

            for(let s in atts)
                expect(a.getAtt(s)).to.be.equals(atts[s]);

            let b = randomElement();

            b.setAtts(atts);

            for(let s in atts)
                expect(b.getAtt(s)).to.be.equals(atts[s]);
        });
    });

    it('should animate', function () {

        class MyElement extends Element<HTMLDivElement>{
            get value(): number {
                return this.getPropertyValue('value', Number, 0);
            }
            set value(value: number) {
                this.setPropertyValue('value', value, Number);
            }
        }

        let e = new MyElement(document.createElement('div'));

        e.animate({
            value: 100
        }, 1)

    });

});

describe('UiElement', () => {

    it('should langDirection', function () {

        let e = new UiElement(document.createElement('div'));

        e.langDirection = LanguageDirection.LTR;

        expect(e.getAtt('dir')).to.be.equals('ltr');

        e.langDirection = LanguageDirection.RTL;

        expect(e.getAtt('dir')).to.be.equals('rtl');

        e.langDirection = LanguageDirection.AUTO;

        expect(e.getAtt('dir')).to.be.equals('auto');

    });

});

describe('DivElement', () => {

    it('should Initialize with class', function () {

        let cutsie = DivElement.withClass('cutsie');

        expect(cutsie.hasClass('cutsie')).to.be.true;

        let pretty = new DivElement('pretty');

        expect(pretty.hasClass('pretty')).to.be.true;

        let scratch = document.createElement('div');

        let d = new DivElement(scratch);

        expect(d.raw).to.be.equals(scratch);

    });

});

describe('Label', () => {

    it('should updateElements', function () {

        let a = new Label("Something");

        expect(a.text).to.be.equals("Something");
        expect(a.eText.isPresent).to.be.false;
        expect(a.eDescription.isPresent).to.be.false;
        expect(a.eIcon.isPresent).to.be.false;
        expect(a.eGroup.isPresent).to.be.false;

        a.description = Optional.of("Else");

        expect(a.description.orThrow()).to.be.equals("Else");
        expect(a.eText.isPresent).to.be.true;
        expect(a.eDescription.isPresent).to.be.true;
        expect(a.eIcon.isPresent).to.be.false;
        expect(a.eGroup.isPresent).to.be.false;

        a.icon = Optional.of(new Icon());

        expect(a.description.orThrow()).to.be.equals("Else");
        expect(a.eText.isPresent).to.be.true;
        expect(a.eDescription.isPresent).to.be.true;
        expect(a.eIcon.isPresent).to.be.true;
        expect(a.eGroup.isPresent).to.be.false;
    });

});
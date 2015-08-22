document.registerElement("Blocks-Input", {
    prototype: Object.create(HTMLElement.prototype, {
        // constructors:
        createdCallback: {
            value: function () {
                self = $(this);
                if (this.wasCreated) return;
                //self.shadow=$(this.createShadowRoot());
                $("<input type='hidden'/>").prop("name", self.attr("name")).appendTo(self);
                $("<div/>").css("display", "inline").appendTo(self);
                self.keydown(function (e) {
                    if (e.which == 35) this.inputs.last().focus();
                    else if (e.which == 36) this.inputs.first().focus();
                    else if (!this.fixed) {
                        if (e.which == 38) this.addInput();
                        if (e.which == 40) this.removeInput();
                    }
                });
                $("<button id='minus' type='button' />").text("-").click(this.removeInput).appendTo(self);
                $("<button id='plus' type='button' />").text("+").click(this.addInput).appendTo(self);
                this.fixed = this.fixed; //its actualy has a meaning...
                if (self.attr("value")) this.value = self.attr("value");
                else this.length = parseInt(self.attr("length") || 4);
                this.disabled = $(this).attr("disabled");
                if (self.attr("disabled-value")) this.disabledValue = self.attr("disabled-value");
                if (self.attr("tabindex")) {
                    this.inputs.first().attr("tabindex", self.attr("tabindex"));
                    self.attr("tabindex", "");
                }
                this.updateNative();
            }
        },
        newInput: {
            value: function () {
                return $('<input type="text" size="30" maxlength="1" autocomplete="off"/>').keydown(function (e) {
                    self = $(this).closest("Blocks-Input").get(0);
                    if (e.which == 37) { // left
                        if (self.next(this).length == 0 && !self.fixed) self.addInput().focus();
                        else self.next(this).focus();
                    }
                    if (e.which == 39) self.prev(this).focus();
                    if (e.which == 8 || e.which == 46)
                        if ($(this).val()) $(this).val("").css("background-color", "");
                        else {
                            (e.which == 8 ? self.prev(this) : self.next(this)).focus().val("").css("background-color", "");
                            if ($(this).is(self.inputs.last()) && !self.fixed)
                                self.removeInput();
                        }
                    self.updateNative();
                }).keypress(function (e) {
                    if (e.which == 13) return e.stopPropagation();
                    if (e.which == 0 || e.which == 8) return; // firefox is shit.
                    $(this).val("").css("background-color", (e.which == 32 ? "Black" : ""));
                }).on("input", function (e) {
                    self = $(this).closest("Blocks-Input").get(0);
                    thenext = self.next($(this));
                    (thenext.length > 0 || self.fixed ? thenext : self.addInput()).focus();
                    self.updateNative();
                });
            }
        },
        // constants:
        animConst: {
            get: function () {
                return 200;
            }
        },
        filter: {
            get: function () {
                return ":not(.dead, [disabled])";
            }
        },
        // getters:
        native: {
            get: function () {
                return $(this).children("input");
            }
        },
        inputsDiv: {
            get: function () {
                return $(this).children("div");
            }
        },
        inputs: {
            get: function () {
                return this.inputsDiv.children(this.filter);
            }
        },
        allInputs: {
            get: function () {
                return this.inputsDiv.children(":not(.dead)");
            }
        },
        plus: {
            get: function () {
                return $("#plus", this);
            }
        },
        minus: {
            get: function () {
                return $("#minus", this);
            }
        },
        // functions:
        updateNative: {
            value: function () {
                $(this.native).val($(this).val());
            }
        },
        addInput: {
            value: function () {
                self = $(this).closest("Blocks-Input").get(0);
                if (self.length >= 30) return self.inputs.last();
                a = $(self.newInput()).hide().appendTo(self.inputsDiv).show(self.animConst);
                self.updateNative();
                return a;
            }
        },
        removeInput: {
            value: function () {
                self = $(this).closest("Blocks-Input").get(0);
                if (self.length <= 2) return;
                toRemove = self.inputs.last();
                if (toRemove.is(":focus")) self.prev(toRemove).focus();
                toRemove.hide(self.animConst, function () {
                    $(this).remove();
                }).addClass("dead");
                self.updateNative();
            }
        },
        focus: {
            value: function () {
                this.inputs.first().focus();
            }
        },
        next: {
            value: function (input) {
                return $(this.inputs[this.inputs.index(input) + 1]);
            }
        },
        prev: {
            value: function (input) {
                return $(this.inputs[this.inputs.index(input) - 1]);
            }
        },
        // properties:
        length: {
            get: function () {
                return this.inputs.length;
            },
            set: function (len) {
                self = $(this);
                while (this.length > len)
                    this.inputs.last().remove();
                for (var i = this.length; i < len; i++)
                    this.inputsDiv.append(this.newInput());
            }
        },
        value: {
            get: function () {
                return (this.allInputs.map(function () {
                    var x = $(this).val();
                    return x == "" ? "?" : x;
                }) || []).get().join("");
            },
            set: function (str) {
                this.length = str.length;
                for (var i = 0, len = str.length; i < len; i++)
                    this.allInputs.eq(i).val(str[i] == "?" ? "" : str[i]).css("background-color", (str[i] == ' ' ? "Black" : ""));
                this.updateNative();
            }
        },
        disabledValue: {
            set: function (str) {
                this.value = str;
                this.inputs.each(function () {
                    if ($(this).val()) $(this).prop('disabled', true);
                });
            }
        },
        disabled: {
            get: function () {
                return this.inputs.toArray().every(function (elem) {
                    return $(elem).prop('disabled');
                });
            },
            set: function (dis) {
                dis = dis ? true : false;
                this.inputs.prop('disabled', dis);
            }
        },
        fixed: {
            get: function () {
                return $(this).attr("fixed") == "true";
            },
            set: function (val) {
                if (val) {
                    this.minus.hide();
                    this.plus.hide();
                }
                else {
                    this.minus.show();
                    this.plus.show();
                }
                if (this.fixed != val)
                    this.setAttribute("fixed", val ? "true" : "false");
            }
        },
        wasCreated: {
            get: function () {
                return $("input", this).length > 0;
            }
        },
        // events:
        attributeChangedCallback: {
            value: function (name, previousValue, value) {
                switch (name) {
                    case "disabled":
                        this.disabled = value;
                        break;
                    case "length":
                        this.length = parseInt(value);
                        break;
                    case "value":
                        this.value = value;
                        break;
                    case "fixed":
                        this.fixed = (value == "true");
                        break;
                    case "disabled-value":
                        this.disabledValue = value;
                        break;
                }
            }
        }
    })
});
document.registerElement("Blocks-Input", {
    prototype: Object.create(HTMLElement.prototype, {
        // constructors:
        createdCallback: {
            /** The Blocks-Input constructor. called on element create (differ a bit between browsers). */
            value: function () {
                self = $(this);
                if (this.wasCreated) return;
                //self.shadow=$(this.createShadowRoot());
                $("<input type='hidden'/>").appendTo(self);
                this.name = self.attr("name");
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
            /** 
            * Constructor for a single input element inside blocks-input.
            * Defines its behavior under key presses, input changes, focus, blur, etc...
            */
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
            /** Const describing the length of the show/hide of the inputs */
            get: function () {
                return 200;
            }
        },
        maxLength: {
            /** Const describing the max allowed characters in Blocks-input. */
            get: function () {
                return 30;
            }
        },
        filter: {
            /** Const describing the dom filter string to apply to inputsDiv.children() to get all living inputs in current Blocks-input. */
            get: function () {
                return ":not(.dead, [disabled])";
            }
        },
        // getters:
        native: {
            /** A regular hidden input element used for form submiting. */
            get: function () {
                return $(this).children("input");
            }
        },
        inputsDiv: {
            /** A div containing all the vissible inputs (without native and the +- buttons). */
            get: function () {
                return $(this).children("div");
            }
        },
        inputs: {
            /** All the vissible not-disabled inputs (without native and the +- buttons). */
            get: function () {
                return this.inputsDiv.children(this.filter);
            }
        },
        allInputs: {
            /** All the vissible inputs (without native and the +- buttons). */
            get: function () {
                return this.inputsDiv.children(":not(.dead)");
            }
        },
        plus: {
            /** The + button. */
            get: function () {
                return $("#plus", this);
            }
        },
        minus: {
            /** The - button. */
            get: function () {
                return $("#minus", this);
            }
        },
        // functions:
        updateNative: {
            /** Copies the current value of the blocks-input to the native input. */
            value: function () {
                $(this.native).val($(this).val());
            }
        },
        addInput: {
            /** Adds (and returns) an input to the end of blocks-input. If the element already has 30 inputs, cancels the addition and returns the last input in inputs. */
            value: function () {
                self = $(this).closest("Blocks-Input").get(0);
                if (self.length >= self.maxLength) return self.inputs.last();
                a = $(self.newInput()).hide().appendTo(self.inputsDiv).show(self.animConst);
                self.updateNative();
                return a;
            }
        },
        removeInput: {
            /** Removes the last input of blocks-input. If the element has only 2 inputs, cancels the remaval. */
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
            /** Focuses on the first not-disabled input in the blocks-input. */
            value: function () {
                this.inputs.first().focus();
            }
        },
        next: {
            /** Given a input, returns the successive of that input in this.inputs (visible not-disabled inputs in current blocks-input). */
            value: function (input) {
                return $(this.inputs[this.inputs.index(input) + 1]);
            }
        },
        prev: {
            /** Given a input, returns the predecessive of that input in this.inputs (visible not-disabled inputs in current blocks-input). */
            value: function (input) {
                return $(this.inputs[this.inputs.index(input) - 1]);
            }
        },
        // properties:
        name: {
            /** The 'name' html property of the blocks-input. */
            get: function () {
                return this.native.prop("name");
            },
            set: function (val) {
                this.native.prop("name", val);
            }
        },
        length: {
            /** The current length of the blocks-input in characters. */
            get: function () {
                return this.allInputs.length;
            },
            set: function (len) {
                self = $(this);
                while (this.length > len)
                    this.inputs.last().remove();
                for (var i = this.length; i < len && this.length < this.maxLength; i++)
                    this.inputsDiv.append(this.newInput());
                this.updateNative();
            }
        },
        value: {
            /** The current value of the blocks-input as string. blank inputs value is represented as '?'. */
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
            /** Sets the value of the blocks-input to str, disabling every non blank input afterwards */
            set: function (str) {
                this.value = str;
                this.inputs.each(function () {
                    if ($(this).val()) $(this).prop('disabled', true);
                });
            }
        },
        disabled: {
            /** Gets or Sets whether all inputs are disabled. */
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
            /** Gets or Sets whether the blocks-input length can change (by up\down arrows or +- buttons), and whether or not the +- buttons is visible. */
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
            /** Gets whether the blocks-input was initialized by createdCallback. */
            get: function () {
                return $("input", this).length > 0;
            }
        },
        // events:
        attributeChangedCallback: {
            /** The Blocks-Input attributeChanged event. */
            value: function (name, previousValue, value) {
                switch (name) {
                    case "disabled":
                        this.disabled = value;
                        break;
                    case "name":
                        this.name = value;
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
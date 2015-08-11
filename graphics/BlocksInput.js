document.registerElement("Blocks-Input", {
    prototype: Object.create(HTMLElement.prototype, {
        newInput: {
            value: function () {
                return $('<input type="text" size="30" maxlength="1" autocomplete="off"/>').keydown(function (e) {
                    if (e.which == 13) return false;
                    self = $(this).closest("Blocks-Input").get(0);
                    if (e.which == 37) { // left
                        if (self.next(this).length == 0 && !self.isFixedLength) self.addInput().focus();
                        else self.next(this).focus();
                    }
                    if (e.which == 46) self.next(this).focus().val("").css("background-color", "");
                    if (e.which == 39) self.prev(this).focus();
                    if (e.which == 8) if ($(this).val()) $(this).val("").css("background-color", "");
                    else self.prev(this).focus().val("").css("background-color", "");
                }).keypress(function (e) {
                    self = $(this).closest("Blocks-Input").get(0);
                    $(this).css("background-color", (e.keyCode == 32 ? "Black" : ""));
                    self.next($(this).val("")).focus();
                }).change(function () {
                    $(this).closest("Blocks-Input").get(0).updateNative();
                });
            }
        },
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
        inputs: {
            get: function () {
                return this.inputsDiv.children(this.filter);
            }
        },
        allInputs: {
            get: function () {
                return this.inputsDiv.children();
            }
        },
        createdCallback: {
            value: function () {
                self = $(this);
                //self.shadow=$(this.createShadowRoot());
                this.native = $("<input type='hidden'/>").prop("name", self.attr("name")).appendTo(self);
                this.inputsDiv = $("<div/>").css("display", "inline").appendTo(self);
                this.isFixedLength = self.attr("fixed") == "true";
                if (!this.isFixedLength) {
                    self.keydown(function (e) {
                        if (e.which == 38) this.addInput();
                        if (e.which == 40) this.removeInput();
                    });
                    this.minus = $("<button />").text("-").click(this.removeInput).appendTo(self);
                    this.plus = $("<button />").text("+").click(this.addInput).appendTo(self);
                }
                if (self.attr("value")) this.value = self.attr("value");
                else this.length = parseInt(self.attr("length") || 4);
                this.disabled = $(this).attr("disabled");
            }
        },
        addInput: {
            value: function () {
                self = $(this).closest("Blocks-Input").get(0);
                return $(self.newInput()).hide().appendTo(self.inputsDiv).show(self.animConst);
            }
        },
        updateNative: {
            value: function () {
                $(this.native).val($(this).val());
            }
        },
        removeInput: {
            value: function () {
                self = $(this).closest("Blocks-Input").get(0);
                if (self.length <= 2) return;
                toRemove = self.inputs.last();
                if (toRemove.is(":focus")) toRemove.prev(":not(.dead)").focus();
                toRemove.hide(self.animConst, function () {
                    $(this).remove();
                }).addClass("dead");
            }
        },
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
        disabled: {
            set: function (dis) {
                dis = dis ? true : false;
                this.inputs.prop('disabled', dis);
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
        }
    })
});
document.registerElement("Blocks-Input", {
    prototype: Object.create(HTMLElement.prototype, {
        newInput: {
            value: function () {
                return $('<input type="text" size="30" maxlength="1" autocomplete="off"/>').keydown(function (e) {
                    self = $(this).closest("Blocks-Input").get(0);
                    if (e.which == 37) {
                        if ($(this).next(self.filter).length == 0 && !self.isFixedLength) self.addInput().focus();
                        else $(this).next(self.filter).focus();
                    }
                    if (e.which == 46) $(this).next(self.filter).focus().val("").css("background-color", "");
                    if (e.which == 39) $(this).prev(self.filter).focus();
                    if (e.which == 8) if ($(this).val()) $(this).val("").css("background-color", "");
                    else $(this).prev(self.filter).focus().val("").css("background-color", "");
                }).keypress(function (e) {
                    self = $(this).closest("Blocks-Input").get(0);
                    $(this).css("background-color", (e.keyCode == 32 ? "Black" : ""));
                    $(this).val("").next(self.filter).focus();
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
                return ":not(.dead)";
            }
        },
        inputs: {
            get: function () {
                return this.inputsDiv.children(this.filter);
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
                return (this.inputs.map(function () {
                    var x = $(this).val().trim();
                    return x == "" ? "?" : x;
                }) || []).get().join("");
            },
            set: function (str) {
                this.length = str.length;
                for (var i = 0, len = str.length; i < len; i++)
                    this.inputs.eq(i).val(str[i] == "?" ? "" : str[i]).css("background-color", (str[i] == ' ' ? "Black" : ""));
                this.updateNative();
            }
        },
        disabled: {
            set: function (dis) {
                dis = dis ? true : false;
                this.inputs.prop('disabled', dis);
            }
        }
    })
});
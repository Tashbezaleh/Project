var gal = document.registerElement("Blocks-Input", {
    prototype: Object.create(HTMLElement.prototype, {
        newInput: {
            value: function () {
                return $('<input type="text" size="30" maxlength="1" autocomplete="off"/>').keydown(function (e) {
                    self = $(this).closest("Blocks-Input").get(0);
                    if (e.which == 37) {
                        if ($(this).next(":not(.dead)").length == 0 && !self.isFixedLength) self.addInput().focus();
                        else $(this).next(":not(.dead)").focus();
                    }
                    if (e.which == 46) $(this).next(":not(.dead)").focus().val("").css("background-color", "White");
                    if (e.which == 39) $(this).prev(":not(.dead)").focus();
                    if (e.which == 8) if ($(this).val()) $(this).val("").css("background-color", "White");
                    else $(this).prev(":not(.dead)").focus().val("").css("background-color", "White");
                }).keypress(function (e) {
                    $(this).css("background-color", (e.keyCode == 32 ? "Black" : "White"));
                    $(this).val("").next(":not(.dead)").focus();
                });
            }
        },
        animConst: {
            get: function () {
                return 200;
            }
        },
        inputs: {
            get: function () {
                return this.inputsDiv.children(":not(.dead)");
            }
        },
        createdCallback: {
            value: function () {
                self = $(this);
                //self.shadow=$(this.createShadowRoot());
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
            }
        },
        addInput: {
            value: function () {
                self = $(this).closest("Blocks-Input").get(0);
                return $(self.newInput()).hide().appendTo(self.inputsDiv).show(self.animConst);
            }
        },
        removeInput: {
            value: function () {
                self = $(this).closest("Blocks-Input").get(0);
                alert($(self).val());
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
                    var x=$(this).val().trim();
                    return x==""?"?":x;
                }) || []).get().join("");
            },
            set: function (str) {
                this.length = str.length;
                for (var i = 0, len = str.length; i < len; i++)
                    this.inputs.eq(i).val(str[i]=="?"?"":str[i]).css("background-color", (str[i] == ' ' ? "Black" : "White"));
            }
        }
    })
});
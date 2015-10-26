/**
 * grid.jquery.js
 *
 * This file is having native javascript code of table to create Agile LLP Board. 
 * I have used JavaScript and created a jquery plugin to create Table. Data would get saved in HTML5 Localstorage
 * User can create multiple instance of Table as per below requirement
 *
 *	$("#container-name").grid({
 *      row: 1,
 *      col: 2,
 *      flag: true
 *   }); // By default it will create a grid
 * 
 * @project   Agile LLP Board
 * @date      26-10-2015
 * @author    Anand Deep Singh
 * @email     singh.ananddeep@gmail.com
 *
 * @dependency jquery-1.10.2.min.js
 * @dependency jquery-ui.js
 *
 */
 
(function($) {
    $.fn.grid = function(method) {

        // Assign selector object to new object
        var $this = this,
            method = method || false;
			flag = method.flag || false;



        var addCol = function() {
			var parentTr = $($this).find("table.customTable tr"),
				rowCount = parentTr.length;


			for (var i = 0; i < rowCount; i++) {
				if (i === 0) {
					var newRow = document.createElement('td'),
						cellColumnText = "<h3>new Text</h3>";

					newRow.setAttribute("contenteditable", true);
					newRow.innerHTML = cellColumnText;
					parentTr[i].appendChild(newRow);

				} else {
					var newRow = document.createElement('td');
					newRow.setAttribute("contenteditable", true);
					parentTr[i].appendChild(newRow);
				}
			}

			return this;
		},

		getChit = function() {

			var dataValueCounter = $(".card:last").attr("data-count")
			counter = parseInt(dataValueCounter),
				newDivName = "content-container";

			if (dataValueCounter) {
				newCounter = counter + 1;

				$(".cardClone").clone()
					.insertAfter(".card:last")
					.removeClass("hide cardClone")
					.not("cardClone:first")
					.addClass("show")
					.draggable()
					.attr("id", newDivName + newCounter)
					.attr("data-count", newCounter)
					.dragBackCard;
				draggableCard();
			}

			return this;
        },

		dragBackCard = function() {

			$(".content").draggable({
				revert: "invalid"
			});


			return this;
		},
		
		draggableCard = function() {
			
			var _this = this,
				$card = $(".card");
			
			$card.on("click", function() {

				$(_this).draggable("option", "disabled", true); //Invoke the method:
				$(_this).attr('contenteditable', 'true');
			}).blur(function() {
				$(_this).draggable('option', 'disabled', false);
				$(_this).attr('contenteditable', 'false');
			}).draggable();

			$card.hover(function() {
				$(_this).find(".cross").show();
			}, function() {
				$(_this).find(".cross").hide();
			});


			$card.draggable({
				revert: "invalid"
			});

			$("#myTable").droppable({
				activeClass: "ui-state-default",
				hoverClass: "ui-state-hover",
				drop: function(event, ui) {}
			});
			
			return this;
		},

		createTable = function() {

			if (localStorage) {
				if (localStorage.getItem("AgileLLP") == null) {
					// first time user

					if (typeof method === "object") {
						row = method.row,
						col = method.col;

					} else if (typeof method === "undefined") {
						row = 1, // default row
						col = 2; // default col
					}

					var defaults = {
							tbl: null,
							tblBody: null,
							i: 0,
							text: "<h3> New Text </h3>"
						},

						createTR,
						createTD,
						_rowCount = row, //No of row, which needs to be generated
						_colCount = col; //No of column, which needs to be generated

					defaults.tbl = document.createElement("table");
					defaults.tbl.setAttribute("width", "100%");
					defaults.tbl.setAttribute("class", "customTable");
					defaults.tblBody = document.createElement("tbody");
					defaults.tbl.appendChild(defaults.tblBody);

					for (var i = 0; i < _rowCount; i++) {
						// creates a table row
						createTR = document.createElement('tr');

						for (var j = 0; j < _colCount; j++) {
							// creates a table td

							createTD = document.createElement('td');
							createTD.setAttribute("contenteditable", true);
							createTD.innerHTML = defaults.text;

							// appending td > tr
							createTR.appendChild(createTD);
						}
						tbl = defaults.tblBody.appendChild(createTR);
					}
					$($this.selector).append(defaults.tbl);


				} else { // 2nd time user;
					showColumn();

					// card making card draggable 
					draggableCard();
				}
			} else {
				alert("localStorage Not Support")
			}

			return this;
		},
		
		showColumn = function() {

			var data = JSON.parse(localStorage.getItem("AgileLLP"))
				dataLen = data.length;

			if (dataLen) {

				// getting Column data without Array of Array

				var result = []; // This will be updated array

				for (var i = 0; i < dataLen; i++) {
					/* If the value held at the current index ISN'T an array
					 * add it to our result array. */

					if (!(data[i] instanceof Array)) {
						result.push(data[i]); //result would be updated array
					}
				}

				//creating existing table from localstorage

				var tbl = document.createElement("table"),
					tblBody = document.createElement("tbody"),
					tableTr = document.createElement("tr"),
					tableTd = document.createElement("td"),
					str = '';
				tbl.appendChild(tblBody);

				for (var i = 0; i < 1; i++) {

					for (var j = 0; j < result.length; j++) {
						var JSONData = "<h3>" + result[j] + "</h3>";
						tableTd.innerHTML = JSONData;
						tableTd.setAttribute("contenteditable", true);
						str += tableTd.outerHTML;
					}

					tableTr.innerHTML = str;
				};

				tblBody.appendChild(tableTr);

				tbl.appendChild(tblBody);
				tbl.setAttribute("class", "customTable");


				var element = document.getElementsByClassName('elementId');
				document.getElementById("myTable").appendChild(tbl)

				// creating chits from existing code in Localstorage
				showChit();
			}
			return this;
		},

		showChit = function() {

			var existingData = JSON.parse(localStorage.getItem("AgileLLP")),
				//existingDataLen = Object.keys(existingData).length,
				existingDataLen = existingData.length,
				html = '';

			for (var i = 0; i < existingDataLen; i++) {
				if (existingData[i] instanceof Array) {
					var objArr = existingData[i];

					for (var x = 0, xlen = Object.keys(objArr).length; x < xlen; x++) {
						var obj = objArr[x];
						//console.log(obj.leftPos)
						html += "<div class='card ui-draggable ui-draggable-handle' data-count='" + obj.dataCount + "' id='" + obj.divName + "' style='left:" + obj.leftPos + "px;top:" + obj.topPos + "px' ><div class='content' contenteditable='true'>" + obj.content + "</div></div>";

					}
				}
			}

			$("#card-wrapper").append(html);

			return this;
		},

		saveData = function() {

			var tableTd = $(".customTable tr td"),
				colLen = tableTd.length,
				tdData = [],
				tdDataText,
				$chitData = $("#card-wrapper"),
				$chitDataObjContainer = [],
				$chitDataObj = [];

			if (localStorage) {
				var $visibleCard = $("#card-wrapper .card:visible");

				if (localStorage.getItem("AgileLLP") == null) { // first time user

					tableTd.each(function() {
						tdDataText = $(this).find("h3").text();
						tdData.push(tdDataText)
					});

					// content getting

					if ($visibleCard.length > 0) {
						$visibleCard.each(function() {

							var _this = this,
								$divName = $(_this).attr("id")
								$content = $(_this).children(".content").text(),
								topPos = $(_this).position().top,
								leftPos = $(_this).position().left,
								dataCount = $(_this).attr("data-count");

							$chitDataObj = {
								"divName": $divName,
								"content": $content,
								"topPos": topPos,
								"leftPos": leftPos,
								"dataCount": dataCount
							}
							$chitDataObjContainer.push($chitDataObj);
						});
						tdData.push($chitDataObjContainer);
					}
					localStorage.setItem("AgileLLP", JSON.stringify(tdData));
					alert("Data Saved");

				} else { // 2nd time user, after deleting 

					var oldData = JSON.parse(localStorage.getItem("AgileLLP")),
						dataLen = oldData.length;

					tableTd.each(function() {
						tdDataText = $(this).find("h3").text();
						tdData.push(tdDataText)
					});

					// content getting
					$visibleCard.each(function() {

						var _this = this,
							$divName = $(_this).attr("id")
							$content = $(_this).children(".content").text(),
							topPos = $(_this).position().top,
							leftPos = $(_this).position().left,
							dataCount = $(_this).attr("data-count");;

						$chitDataObj = {
							"divName": $divName,
							"content": $content,
							"topPos": topPos,
							"leftPos": leftPos,
							"dataCount": dataCount
						}
						
						$chitDataObjContainer.push($chitDataObj);
					});

					if ($chitDataObjContainer.length > 0) {
						tdData.push($chitDataObjContainer);
					}

					localStorage.setItem("AgileLLP", JSON.stringify(tdData));

					alert("Data Updated")
				}
			} else {
				alert('Local storage not supported. Please get a proper browser');
			}
		};

        //default invoking create table function
        if (flag) createTable(method);

        return {
            addCol: addCol,
            getChit: getChit,
            createTable: createTable,
            saveData: saveData,
            draggableCard: draggableCard
        }
    };
})(jQuery);
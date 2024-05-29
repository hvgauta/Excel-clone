let defaultProperties = {
    text : "",
    "font-weight":"",
    "font-style":"",
    "text-decoration":"",
    "text-align":"left",
    "background-color":"#ffffff",
    "color":"#000000",
    "font-family":"Noto Sens",
    "font-size":"14px",
}
let cellData = {
    "Sheet1":{}
}
let selectedSheet = "Sheet1";
let totalSheet = 1;
let lastSheet = 1;


$(document).ready(function(){
    let cellConatiner = $(".input-cell-conatiner");
    for(let i=1;i<=100;i++){
        let ans="";
        let n= i;
        while(n>0){
            let rem = n % 26;
            if(rem == 0){
                ans = "Z" + ans;
                n = Math.floor(n/26) - 1;
            }else{
                ans = String.fromCharCode(rem -1 + 65) + ans;
                n = Math.floor(n/26);
            }
        }
        let column = $(`  <div class="column-name colId-${i}" id="colCode-${ans}">${ans}</div>`)
        $(".column-name-container").append(column);

        let row = $(`<div class="row-name" id="rowId-${i}">${i}</div>`);
        $(".row-name-container").append(row);
    }

    for(let i = 1; i <= 100; i++){
        let row = $(`<div class="row-cell"></div>`);
        for(let j = 1; j <= 100; j++){
            let colCod = $(`.colId-${j}`).attr("id").split("-")[1];
            let column = $(`<div class="input-cell" contenteditable="false" id="row-${i}-col-${j}" data="code-${colCod}"></div>`);
            row.append(column);
        }
        $(".input-cell-container").append(row);
    }
    $(".align-icon").click(function(){
        $(".align-icon.selected").removeClass("selected");
        $(this).addClass("selected");
    })
    $(".style-icon").click(function(){
        $(this).toggleClass("selected");
    })
    $(".input-cell").click(function(e){
        if(e.ctrlKey){
            let[rowId,colId] = getRowCol(this);
            if(rowId>1){
                let topCellSelected = $(`#row-${rowId-1}-col-${colId}`).hasClass("selected");
                if( topCellSelected){
                    $(this).addClass("top-cell-selected");
                    $(`#row-${rowId-1}-col-${colId}`).addClass("bottom-cell-selected");
                }
            }

            if(rowId<100){
                let bottomCellSelected = $(`#row-${rowId+1}-col-${colId}`).hasClass("selected");
                if( bottomCellSelected){
                    $(this).addClass("bottom-cell-selected");
                    $(`#row-${rowId+1}-col-${colId}`).addClass("top-cell-selected");
                }
            }

            if(colId > 1){
                let leftCellSelected = $(`#row-${rowId}-col-${colId-1}`).hasClass("selected");
                if( leftCellSelected){
                    $(this).addClass("left-cell-selected");
                    $(`#row-${rowId}-col-${colId-1}`).addClass("right-cell-selected");
                }
            }

            if(colId < 100){
                let rightCellSelected = $(`#row-${rowId}-col-${colId+1}`).hasClass("selected");
                if( rightCellSelected){
                    $(this).addClass("right-cell-selected");
                    $(`#row-${rowId}-col-${colId+1}`).addClass("left-cell-selected");
                }
            }
            $(this).addClass("selected");
        }
        else{
            $(".input-cell.selected").removeClass("selected");
            $(this).addClass("selected");
        }
        changeHeader(this);
    })
    function changeHeader(ele){
        let [rowId,colId] = getRowCol(ele);
        let cellInfo = defaultProperties;
        if(cellData[selectedSheet][rowId] && cellData[selectedSheet][rowId][colId]){
             cellInfo = cellData[selectedSheet][rowId][colId];
        }
        cellInfo["font-weight"] ? $(".fa-bold").addClass("selected"): $(".fa-bold").removeClass("selected");
        cellInfo["font-style"] ? $(".fa-italic").addClass("selected"): $(".fa-italic").removeClass("selected");
        cellInfo["text-decoration"] ? $(".fa-underline").addClass("selected"): $(".fa-underline").removeClass("selected");
        let alignment = cellInfo["text-align"];
        $(".align-icon.selected").removeClass("selected");
        $(".fa-align-" + alignment).addClass("selected");
        $(".background-color-picker").val(cellInfo["background-color"]);
        $(".text-color-picker").val(cellInfo["color"]);
        $(".font-family-select").val(cellInfo["font-family"]);
        $(".font-family-select").css("font-family", cellInfo["font-family"]);
        $(".font-size-select").val(cellInfo["font-size"]);
    }
    
    $(".input-cell").dblclick(function(){
        $(".input-cell.selected").removeClass("selected");
        $(this).addClass("selected");
        $(this).attr("contenteditable","true");
        $(this).focus();
    })

    $(".input-cell").blur(function(){
        $(".input-cell.selected").attr("contenteditable","false");
        updateCell("text",$(this).text());
    })

    $(".input-cell-container").scroll(function(){
        $(".column-name-container").scrollLeft(this.scrollLeft);
        $(".row-name-container").scrollTop(this.scrollTop);
    })

});

function getRowCol(ele){
    let idArray = $(ele).attr("id").split("-");
    let rowId = parseInt(idArray[1]);
    let colId = parseInt(idArray[3]);
    return [rowId,colId]
}

function updateCell(property,value,defaultPossible){
    $(".input-cell.selected").each(function(){
        $(this).css(property,value);
        let[rowId,colId] = getRowCol(this);
        if(cellData[selectedSheet][rowId]){
            if(cellData[selectedSheet][rowId][colId]){
                cellData[selectedSheet][rowId][colId][property] = value;
            }else{
                cellData[selectedSheet][rowId][colId] = {...defaultProperties};
                cellData[selectedSheet][rowId][colId][property] = value;
            }
        }else{
            cellData[selectedSheet][rowId] = {};
            cellData[selectedSheet][rowId][colId] = {...defaultProperties};
            cellData[selectedSheet][rowId][colId][property] = value;
        }
        if(defaultPossible && (JSON.stringify(cellData[selectedSheet][rowId][colId]) === JSON.stringify(defaultPossible))){
            delete cellData[selectedSheet][rowId][colId];
            if(Object.keys(cellData[selectedSheet][rowId]).lenght == 0){
                delete cellData[selectedSheet][rowId][colId];
            }
        }
    })  
}

$(".fa-bold").click(function(){
    if($(this).hasClass("selected")){
        updateCell("font-weight","",true);
    }
    else{
        updateCell("font-weight","bold",false);
    }
})

$(".fa-italic").click(function(){
    if($(this).hasClass("selected")){
        updateCell("font-style","",true);
    }
    else{
        updateCell("font-style","italic",false);
    }
})

$(".fa-underline").click(function(){
    if($(this).hasClass("selected")){
        updateCell("text-decoration","",true);
    }
    else{
        updateCell("text-decoration","underline",false);
    }
})
$(".fa-align-left").click(function(){
    if(!$(this).hasClass("selected")){
        updateCell("text-align","left",true)
    }
})
$(".fa-align-center").click(function(){
    if(!$(this).hasClass("selected")){
        updateCell("text-align","center",false)
    }
})
$(".fa-align-right").click(function(){
    if(!$(this).hasClass("selected")){
        updateCell("text-align","right",false)
    }
});
$(".color-fill-icon").click(function(){
    $(".background-color-picker").click();
})
$(".color-fill-text").click(function(){
    $(".text-color-picker").click();
})
$(".background-color-picker").change(function(){
    updateCell("background-color",$(this).val())
})
$(".text-color-picker").change(function(){
    updateCell("color",$(this).val())
})
$(".font-family-select").change(function(){
    updateCell("font-family", $(this).val());
     $(".font-family-select").css("font-family", $(this).val());
})
$(".font-size-select").change(function(){
    updateCell("font-size",$(this).val());
})

function emptySheet(){
    let sheetInfo = cellData[selectedSheet];
    for(let i of Object.keys(sheetInfo)){
        for(let j of Object.keys(sheetInfo[i])){
            $(`#row-${i}-col-${j}`).text("");
            $(`#row-${i}-col-${j}`).css("background-color","#ffffff");
            $(`#row-${i}-col-${j}`).css("color", "#000000");
            $(`#row-${i}-col-${j}`).css("text-align", "left");
            $(`#row-${i}-col-${j}`).css("font-weight", "");
            $(`#row-${i}-col-${j}`).css("font-style", "");
            $(`#row-${i}-col-${j}`).css("text-decoration", "");
            $(`#row-${i}-col-${j}`).css("font-family", "Noto Sans");
            $(`#row-${i}-col-${j}`).css("font-size", "14px");
        }
    }
}
function loadSheet(){
    let sheetInfo = cellData[selectedSheet];
    for(let i of Object.keys(sheetInfo)){
        for(let j of Object.keys(sheetInfo[i])){
            let cellInfo = cellData[selectedSheet][i][j];
            $(`#row-${i}-col-${j}`).text(cellInfo["text"]);
            $(`#row-${i}-col-${j}`).css("background-color",cellInfo["background-color"]);
            $(`#row-${i}-col-${j}`).css("color", cellInfo["color"]);
            $(`#row-${i}-col-${j}`).css("text-align", cellInfo["text-align"]);
            $(`#row-${i}-col-${j}`).css("font-weight", cellInfo["font-weight"]);
            $(`#row-${i}-col-${j}`).css("font-style", cellInfo["font-style"]);
            $(`#row-${i}-col-${j}`).css("text-decoration", cellInfo["text-decoration"]);
            $(`#row-${i}-col-${j}`).css("font-family", cellInfo["font-family"]);
            $(`#row-${i}-col-${j}`).css("font-size", cellInfo["font-size"]);
        }
    }
}

$(".add-icon").click(function(){
    emptySheet();
    $(".sheet-tab.selected").removeClass("selected");
    let sheetName = "Sheet" + (lastSheet + 1);
    cellData[sheetName] = {};
    totalSheet += 1;
    lastSheet += 1;
    selectedSheet = sheetName;
    $(".sheet-tab-container").append(`<div class="sheet-tab selected">${sheetName}</div>`);
    $(".sheet-tab.selected").click(function(){
        if(!$(this).hasClass("selected")){
            selectSheet(this);
        }
    })
    
})

$(".sheet-tab").click(function(){
    if(!$(this).hasClass("selected")){
        selectSheet(this);
    }
})

function selectSheet (ele){
    $(".sheet-tab.selected").removeClass("selected");
    $(ele).addClass("selected");
    emptySheet();
    selectedSheet = $(ele).text();
    loadSheet();
}
$(".sheet-tab.selected").contextmenu(function(e){
    e.preventDefault();
    $(".container").append(` <div class="sheet-option-modal">
    <div class="sheet-rename">Rename</div>
    <div class="sheet-delete">Delete</div>
</div>`);
$(".sheet-option-modal").css("left",e.pageX + "px");
})

let selectedCells = [];
let cut = false;

$(".fa-copy").click(function(){
    $(".input-cell.selected").each(function(){
        selectedCells.push(getRowCol(this));
    });
});

$(".fa-scissors").click(function(){
    $(".input-cell.selected").each(function(){
        selectedCells.push(getRowCol(this));
    });
    cut = true;
})

$(".fa-paste").click(function(){
    emptySheet();
    let[rowId,colId] = getRowCol($(".input-cell.selected")[0]);
    let rowDistance = rowId - selectedCells[0][0];
    let colDistance = colId - selectedCells[0][1];
    for(let i of selectedCells){
        let newRowId = i[0] + rowDistance;
        let newColId = i[1] + colDistance;
        if(!cellData[selectedSheet][newRowId]){
            cellData[selectedSheet][newRowId] = {};
        }
        cellData[selectedSheet][newRowId][newColId] = {...cellData[selectedSheet][i[0]][i[1]]};
        if(cut){
            delete cellData[selectedSheet][i[0]][i[1]];
            if(Object.keys(cellData[selectedSheet][i[0]]).length == 0){
                delete cellData[selectedSheet][i[0]];
            }
        }
    }
    if(cut){
        cut = false;
        selectedCells = [];
    }
    loadSheet();
})

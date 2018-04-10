var app = {};

(function() {

    var canvasMain;
    var canvasDisplay;
    var ctxUnit;
    var ctxDisp;
    var nt;

    var units = [];
    var lastMousePos = { x: 0, y: 0 };
    var highlightedUnit = -1;
    var selectedUnit = -1;

    var mainDrawTimer;
    var displayDrawTimer;
    var buildSpawnTimer;
    var unitControllerTimer;

    var start = function() {
        canvasMain = document.getElementById("canvasMain");
        canvasDisplay = document.getElementById("canvasDisplay");
        ctxMain = canvasMain.getContext("2d");
        ctxDisp = canvasDisplay.getContext("2d");
        
        createUnit(25, 25, "base", "plr", "hold");
        createUnit(90, 25, "wfact", "plr", "hold");
        createUnit(220, 50, "tower", "plr", "hold");
        createUnit(200, 120, "tower", "plr", "hold");
        createUnit(180, 200, "tower", "plr", "hold");

        createUnit(735, 435, "base", "ene", "hold");
        createUnit(700, 390, "wfact", "ene", "hold");
        createUnit(600, 410, "tower", "ene", "hold");
        createUnit(620, 350, "tower", "ene", "hold");
        createUnit(640, 280, "tower", "ene", "hold");

        createUnit(710, 400, "man", "ene", "seek");
        createUnit(710, 420, "man", "ene", "defend");
        createUnit(710, 400, "man", "ene", "defend");
        createUnit(710, 380, "man", "ene", "defend");
        createUnit(710, 360, "man", "ene", "seek");
        createUnit(710, 340, "man", "ene", "seek");
        createUnit(710, 200, "htank", "ene", "seek");
        createUnit(650, 400, "ltank", "ene", "seek");
        createUnit(650, 300, "ltank", "ene", "defend");
        createUnit(650, 200, "htank", "ene", "defend");

        canvasMain.addEventListener('click', onCanvasClick, false);
        canvasMain.addEventListener('mousemove', onMouseMove, false);

        canvasDisplay.addEventListener('click', onCanvasDisplayClick, false);

        mainDrawTimer = setInterval(drawMainPage, 10);
        displayDrawTimer = setInterval(drawDisplayPage, 50);
        buildSpawnTimer = setInterval(buildController, 100);
        unitControllerTimer = setInterval(unitController, 40);

    };
    app.start = start;

    var buildController = function() {
        for (var i = 0; i < units.length; i++) {
            var thisUnit = units[i];
            if (thisUnit.alive && thisUnit.build.active) {
                thisUnit.build.progress++;
                if (thisUnit.build.progress >= thisUnit.build.target) {
                    thisUnit.build.progress = thisUnit.build.target;
                    thisUnit.build.active = false;
                    var id = createUnit(thisUnit.x + thisUnit.cx, thisUnit.y + thisUnit.cy, thisUnit.build.type, thisUnit.owner, "spawn-move");
                    var newUnit = units[id];
                    newUnit.move.x = newUnit.x + thisUnit.build.sx;
                    newUnit.move.y = newUnit.y + thisUnit.build.sy;
                    newUnit.aimode = "-none";
                };
            };
        };
    };

    var drawDisplayPage = function() {
        ctxDisp.fillStyle = "#000000";
        ctxDisp.fillRect(0, 0, 250, 500);
        if (selectedUnit === -1) return;

        var thisUnit = units[selectedUnit];
        
        ctxDisp.beginPath();
        ctxDisp.fillStyle = '#ffffff';
        ctxDisp.font = "10px Arial";
        ctxDisp.fillText("Unit: " + thisUnit.type, 10, 20);
        ctxDisp.fillText("Role: " + thisUnit.role, 10, 60);
        ctxDisp.fillText("Action: " + thisUnit.aimode, 10, 80);
        ctxDisp.fillText("Coord: X" + thisUnit.x + " Y" + thisUnit.y, 10, 100);
        ctxDisp.fillText("Move: X" + thisUnit.move.x + " Y" + thisUnit.move.y, 10, 120);
        ctxDisp.fillText("Target: #" + thisUnit.fire.target, 10, 140);

        ctxDisp.beginPath();
        ctxDisp.fillStyle = "#a0a0a0";
        ctxDisp.fillRect(190, 10, 50, 15);
        ctxDisp.beginPath();
        ctxDisp.fillStyle = '#000000';
        ctxDisp.font = "10px Arial";
        ctxDisp.fillText("Unselect", 195, 21);

        if (thisUnit.move.movable && thisUnit.owner === 'plr') {
            // HOLD Order
            ctxDisp.beginPath();
            ctxDisp.fillStyle = "#a0a0a0";
            if (thisUnit.role === 'hold') ctxDisp.fillStyle = "#00a000";
            ctxDisp.fillRect(10, 470, 50, 20);
            ctxDisp.beginPath();
            ctxDisp.fillStyle = '#000000';
            ctxDisp.font = "10px Arial";
            ctxDisp.fillText("HOLD", 20, 482);

            // SEEK Order
            ctxDisp.beginPath();
            ctxDisp.fillStyle = "#a0a0a0";
            if (thisUnit.role === 'seek') ctxDisp.fillStyle = "#00a000";
            ctxDisp.fillRect(70, 470, 50, 20);
            ctxDisp.beginPath();
            ctxDisp.fillStyle = '#000000';
            ctxDisp.font = "10px Arial";
            ctxDisp.fillText("SEEK", 80, 482);

            // DEFEND Order
            ctxDisp.beginPath();
            ctxDisp.fillStyle = "#a0a0a0";
            if (thisUnit.role === 'defend') ctxDisp.fillStyle = "#00a000";
            ctxDisp.fillRect(130, 470, 60, 20);
            ctxDisp.beginPath();
            ctxDisp.fillStyle = '#000000';
            ctxDisp.font = "10px Arial";
            ctxDisp.fillText("DEFEND", 140, 482);
        }

        if (thisUnit.build.builder && thisUnit.owner === 'plr' && thisUnit.type === 'wfact') {
            
            if (thisUnit.build.active) {
                var perc = (230 / thisUnit.build.target) * thisUnit.build.progress;
                ctxDisp.beginPath();
                ctxDisp.fillStyle = "#0000a0";
                ctxDisp.fillRect(10, 435, 230, 25);
                ctxDisp.beginPath();
                ctxDisp.fillStyle = "#00a000";
                ctxDisp.fillRect(10, 435, perc, 25);
                ctxDisp.beginPath();
                ctxDisp.fillStyle = '#aaaaaa';
                ctxDisp.font = "10px Arial";
                ctxDisp.fillText("BUILD PROGRESS", 80, 450);
            };
            
            // LTank Order
            ctxDisp.beginPath();
            ctxDisp.fillStyle = "#a0a0a0";
            if (thisUnit.build.active) ctxDisp.fillStyle = "#0000a0";
            ctxDisp.fillRect(10, 470, 55, 20);
            ctxDisp.beginPath();
            ctxDisp.fillStyle = '#000000';
            ctxDisp.font = "10px Arial";
            ctxDisp.fillText("L.TANK", 20, 482);

            // HTank Order
            ctxDisp.beginPath();
            ctxDisp.fillStyle = "#a0a0a0";
            if (thisUnit.build.active) ctxDisp.fillStyle = "#0000a0";
            ctxDisp.fillRect(75, 470, 55, 20);
            ctxDisp.beginPath();
            ctxDisp.fillStyle = '#000000';
            ctxDisp.font = "10px Arial";
            ctxDisp.fillText("H.TANK", 85, 482);

            // Cancel Order
            ctxDisp.beginPath();
            ctxDisp.fillStyle = "#a00000";
            if (!thisUnit.build.active) ctxDisp.fillStyle = "#0000a0";
            ctxDisp.fillRect(185, 470, 55, 20);
            ctxDisp.beginPath();
            ctxDisp.fillStyle = '#000000';
            ctxDisp.font = "10px Arial";
            ctxDisp.fillText("CANCEL", 195, 482);
            
        }

        var perc = (230 / thisUnit.health.max) * thisUnit.health.current;
        ctxDisp.fillStyle = getHealthColor(thisUnit);
        ctxDisp.fillRect(10, 30, perc, 10);
        ctxDisp.fillStyle = "#0000aa";
        ctxDisp.fillRect(10 + perc, 30, 230 - perc, 10);
    }

    var onMouseMove = function(event) {
        lastMousePos = {
            x: (event.clientX - canvasMain.offsetLeft),
            y: (event.clientY - canvasMain.offsetTop)
        };
    };
    
    var onCanvasClick = function(event) {
        var foundEntry = false;
        for (var i = 0; i < units.length; i++) {
            if (i === selectedUnit) continue;
            var thisUnit = units[i];
            var areaX1 = thisUnit.x - 5;
            var areaX2 = thisUnit.x + thisUnit.health.areaSizeX + 5; 
            var areaY1 = thisUnit.y - 5;
            var areaY2 = thisUnit.y + thisUnit.health.areaSizeY + 5; 
            var drawnBox = false;
            if (lastMousePos.x >= (areaX1) && lastMousePos.x <= (areaX2)) {
                if (lastMousePos.y >= (areaY1) && lastMousePos.y <= (areaY2)) {
                    selectedUnit = i;
                    foundEntry = true;
                    break;
                };
            };
        };
        if (selectedUnit != -1 && !foundEntry) {
            // Blank click, already selected unit/
            var thisUnit = units[selectedUnit];
            if (thisUnit.alive && thisUnit.move.movable && thisUnit.owner === 'plr') {
                thisUnit.move.x = lastMousePos.x;
                thisUnit.move.y = lastMousePos.y;
                thisUnit.aimode = 'move-target';
            };
        };
    };

    var onCanvasDisplayClick = function(event) {
        var sx = (event.clientX - canvasDisplay.offsetLeft);
        var sy = (event.clientY - canvasDisplay.offsetTop);
        
        var thisUnit = units[selectedUnit];

        if (sx >= 190 && sx <= 240) {
            if (sy >= 10 && sy <= 25) {
                selectedUnit = -1;
                return;
            }
        }

        if (selectedUnit === -1) return;

        if (thisUnit.alive && thisUnit.owner === 'plr' && thisUnit.move.movable) {
            if (sx >= 10 && sx <= 60) {
                if (sy >= 470 && sy <= 490) {
                    thisUnit.role = 'hold';
                    thisUnit.aimode = "-none-";
                    thisUnit.fire.target = null;
                    thisUnit.move.x = thisUnit.x;
                    thisUnit.move.y = thisUnit.y;
                };
            };
            if (sx >= 70 && sx <= 120) {
                if (sy >= 470 && sy <= 490) {
                    thisUnit.role = 'seek';
                    thisUnit.aimode = "scan-for-targets";
                    thisUnit.fire.target = null;
                    thisUnit.move.x = thisUnit.x;
                    thisUnit.move.y = thisUnit.y;
                };
            };
            if (sx >= 130 && sx <= 190) {
                if (sy >= 470 && sy <= 490) {
                    thisUnit.role = 'defend';
                    thisUnit.aimode = "scan-for-visual-targets";
                    thisUnit.fire.target = null;
                    thisUnit.move.x = thisUnit.x;
                    thisUnit.move.y = thisUnit.y;
                };
            };
        };

        if (thisUnit.build.builder && thisUnit.owner === 'plr' && thisUnit.type === 'wfact') {
            if (!thisUnit.build.active) {
                if (sx >= 10 && sx <= 65) {
                    if (sy >= 470 && sy <= 490) {
                        thisUnit.build.active = true;
                        thisUnit.build.target = 40;
                        thisUnit.build.progress = 0;
                        thisUnit.build.type = 'ltank';
                    };
                };
                if (sx >= 75 && sx <= 125) {
                    if (sy >= 470 && sy <= 490) {
                        thisUnit.build.active = true;
                        thisUnit.build.target = 450;
                        thisUnit.build.progress = 0;
                        thisUnit.build.type = 'htank';
                    };
                };
            } else {
                if (sx >= 185 && sx <= 240) {
                    if (sy >= 470 && sy <= 490) {
                        thisUnit.build.active = false;
                        thisUnit.build.target = 100;
                        thisUnit.build.progress = 0;
                        thisUnit.build.type = null;
                    };
                };
            };
        };


    };

    var unitController = function() {

        for (var i = 0; i < units.length; i++) {

            var unit = units[i];
            if (!unit.alive) continue;

            switch (unit.role) {
                case "seek":
                    // Find a target anywhere, move towards
                    if (unit.fire.target === null) {
                        // Find a target
                        unit.aimode = "scan-for-targets";
                    } else {
                        var targetUnit = units[unit.fire.target];
                        // Target Available?
                        if (targetUnit && targetUnit.alive) {
                            var targetDist = getDistance(unit, targetUnit);
                            // Target in firing range?
                            if (targetDist <= unit.fire.hitRange) {
                                // Shoot target
                                unit.aimode = "attack-target";
                            } else {
                                // Move closer to target.
                                unit.aimode = "move-to-target";
                            }
                        } else {
                            // Reset, re-scan next frame.
                            unit.fire.target = null;
                            unit.aimode = "-none-";
                        };
                    };
                    break;
                case "defend":
                    if (unit.fire.target === null) {
                        // Find a target
                        unit.aimode = "scan-for-visual-targets";
                        if (unit.move.x != unit.x || unit.move.y != unit.y) {
                            // No target, but we can move against set co-ords
                            unit.aimode = "move-to-coords";
                        };
                    } else {
                        var targetUnit = units[unit.fire.target];
                        // Target Available?
                        if (targetUnit && targetUnit.alive) {
                            var targetDist = getDistance(unit, targetUnit);
                            // Target in firing range?
                            if (targetDist <= unit.fire.hitRange) {
                                // Shoot target
                                unit.aimode = "attack-target";
                            } else {
                                // Move closer to target.
                                unit.aimode = "move-to-target";
                            }
                        } else {
                            // Reset, move back to original position.
                            unit.fire.target = null;
                            unit.aimode = "move-to-coords";
                        };
                    };
                    break;
                case "hold":
                    // Hold position, fire at targets in range.
                    if (unit.fire.target === null) {
                        // Find a target
                        unit.aimode = "scan-for-visual-targets";
                    } else {
                        var targetUnit = units[unit.fire.target];
                        // Target Available?
                        if (targetUnit && targetUnit.alive) {
                            var targetDist = getDistance(unit, targetUnit);
                            // Target in firing range?
                            if (targetDist <= unit.fire.hitRange) {
                                // Shoot target
                                unit.aimode = "attack-target";
                            } else {
                                unit.aimode = "-none-";
                            };
                        } else {
                            // Reset, back to scan.
                            unit.fire.target = null;
                            unit.aimode = "scan-for-visual-targets";
                        };
                    };
                    break;
                case "spawn-move":
                    unit.aimode = "move-to-coords";
                    if (unit.x === unit.move.x && unit.y === unit.move.y) {
                        unit.role = 'defend';
                        unit.aimode = "-none";
                    };
                    break;
                case "avoid":
                    // Avoid enemies, move away?
                    break;
            }
            unit.fire.show = false;
            switch (unit.aimode) {
                case "scan-for-targets":
                    var closestDist = -1;
                    for (var a = 0; a < units.length; a++) {
                        var target = units[a];
                        if (target.owner != unit.owner && target.alive) {
                            var targetDist = getDistance(unit, target);
                            if (closestDist === -1 || targetDist <= closestDist) {
                                unit.fire.target = a;
                                closestDist = targetDist;
                            };
                        };
                    };
                    break;
                case "scan-for-visual-targets":
                    var closestDist = -1;
                    for (var a = 0; a < units.length; a++) {
                        var targetUnit = units[a];
                        if (targetUnit.owner != unit.owner && targetUnit.alive) {
                            var targetDist = getDistance(unit, targetUnit);
                            if (closestDist === -1 || targetDist <= closestDist) {
                                if (targetDist <= unit.fire.sightRange) {
                                    unit.fire.target = a;
                                    closestDist = targetDist;
                                };
                            };
                        };
                    };
                    break;
                case "move-to-target":
                    var targetUnit = units[unit.fire.target];
                    if (unit.move.movable) {
                        var newX = unit.x;
                        var newY = unit.y;
                        if (newX < targetUnit.x) {
                            newX = newX + unit.move.speed;
                        }
                        if (newX > targetUnit.x) {
                            newX = newX - unit.move.speed;
                        }
                        if (newY < targetUnit.y) {
                            newY = newY + unit.move.speed;
                        }
                        if (newY > targetUnit.y) {
                            newY = newY - unit.move.speed;
                        }
                        for (var a = 0; a < units.length; a++) {
                            if (a != i) {
                                var scanUnit = units[a];
                                if (!scanUnit.alive) continue;
                                if (checkCollision(scanUnit, newX, newY)) {
                                    if (!checkCollision(scanUnit, unit.x, newY)) {
                                        newX = unit.x;
                                        unit.move.blockX++;
                                        if (unit.move.blockX > 5) newY--;
                                    } else {
                                        unit.move.blockX = 0;
                                    }
                                    if (!checkCollision(scanUnit, newX, unit.y)) {
                                        newY = unit.y;
                                        unit.move.blockY++;
                                        if (unit.move.blockY > 5) newX--;
                                    } else {
                                        unit.move.blockY = 0;
                                    }
                                }
                            };
                        };
                        unit.x = newX;
                        unit.y = newY;
                    };
                    break;
                case "move-to-coords":
                    if (unit.move.movable) {
                        var newX = unit.x;
                        var newY = unit.y;
                        if (newX < unit.move.x) {
                            newX = newX + unit.move.speed;
                        }
                        if (newX > unit.move.x) {
                            newX = newX - unit.move.speed;
                        }
                        if (newY < unit.move.y) {
                            newY = newY + unit.move.speed;
                        }
                        if (newY > unit.move.y) {
                            newY = newY - unit.move.speed;
                        }
                        if (unit.role != 'spawn-move') {
                            for (var a = 0; a < units.length; a++) {
                                if (a != i) {
                                    var scanUnit = units[a];
                                    if (!scanUnit.alive) continue;
                                    if (checkCollision(scanUnit, newX, newY)) {
                                        if (!checkCollision(scanUnit, unit.x, newY)) {
                                            newX = unit.x;
                                            unit.move.blockX++;
                                            if (unit.move.blockX > 5) newY--;
                                        } else {
                                            unit.move.blockX = 0;
                                        }
                                        if (!checkCollision(scanUnit, newX, unit.y)) {
                                            newY = unit.y;
                                            unit.move.blockY++;
                                            if (unit.move.blockY > 5) newX--;
                                        } else {
                                            unit.move.blockY = 0;
                                        }
                                    }
                                };
                            };
                        };
                        unit.x = newX;
                        unit.y = newY;
                    };
                    break;
                case "attack-target":
                    var targetUnit = units[unit.fire.target];
                    if (targetUnit && targetUnit.alive) {
                        var targetDist = getDistance(unit, targetUnit);
                        if (targetDist <= unit.fire.hitRange) {
                            if (Math.random() > unit.fire.hitChance) {
                                var damage = unit.fire.minDamage + (Math.random() * (unit.fire.maxDamage - unit.fire.maxDamage));
                                unit.fire.show = true;
                                targetUnit.health.current = targetUnit.health.current - damage;
                                if (targetUnit.health.current < 0) {
                                    targetUnit.health.current = 0;
                                    targetUnit.alive = false;
                                };
                            };
                        };
                    };
                    break;
            };
        };

    };

    var checkCollision = function(targetUnit, cx, cy) {
        var areaX1 = targetUnit.x - 5;
        var areaX2 = targetUnit.x + targetUnit.health.areaSizeX + 5; 
        var areaY1 = targetUnit.y - 5;
        var areaY2 = targetUnit.y + targetUnit.health.areaSizeY + 5; 
        if (cx >= (areaX1) && cx <= (areaX2)) {
            if (cy >= (areaY1) && cy <= (areaY2)) {
                return true;
            };
        };
        return false;
    }

    var killUnit = function(unitId) {
        for (var i = 0; i < units.length; i++) {
            if (units[i].fire.target === unitId) {
                units[i].fire.target = null;
            }
        }
        units.splice(unitId, 1);
    }

    var drawSelectionBox = function(selectedUnit, areaX1, areaX2, areaY1, areaY2) {
        var adjustment = 0;
        if (selectedUnit.circle) adjustment = selectedUnit.health.areaSizeX / 2;
        ctxMain.beginPath();
        ctxMain.strokeStyle = "#a0a0a0";
        ctxMain.rect(areaX1 - adjustment, areaY1 - adjustment, areaX2 - areaX1, areaY2 - areaY1);
        ctxMain.stroke();
        if (selectedUnit.fire.hitRange > 0) {
            ctxMain.beginPath();
            ctxMain.strokeStyle = "#aa0000";
            ctxMain.arc(selectedUnit.x, selectedUnit.y, selectedUnit.fire.hitRange, 0, 2 * Math.PI, false);
            ctxMain.stroke();
        };
    };

    var drawMainPage = function() {

        ctxMain.fillStyle = "#000000";
        ctxMain.fillRect(0, 0, 800, 500);

        highlightedUnit = -1;
        for (var i = 0; i < units.length; i++) {
            var thisUnit = units[i];
            if (thisUnit.alive) {
                var unitCol = "#004444";
                if (thisUnit.owner === "ene") {
                    unitCol = "#440000";
                }
    
                if (thisUnit.fire.show) {
                    var targetUnit = units[thisUnit.fire.target];
                    if (targetUnit != null) {
                        ctxMain.beginPath();
                        ctxMain.strokeStyle = unitCol;
                        ctxMain.moveTo(thisUnit.x + thisUnit.cx, thisUnit.y + thisUnit.cy);
                        ctxMain.lineTo(targetUnit.x + targetUnit.cx, targetUnit.y + targetUnit.cy);
                        ctxMain.stroke();
                    }
                }
    
                var areaX1 = thisUnit.x - 5;
                var areaX2 = thisUnit.x + thisUnit.health.areaSizeX + 5; 
                var areaY1 = thisUnit.y - 5;
                var areaY2 = thisUnit.y + thisUnit.health.areaSizeY + 5; 
                var drawnBox = false;
                if (lastMousePos.x >= (areaX1) && lastMousePos.x <= (areaX2)) {
                    if (lastMousePos.y >= (areaY1) && lastMousePos.y <= (areaY2)) {
                        drawSelectionBox(thisUnit, areaX1, areaX2, areaY1, areaY2);
                        drawnBox = true;
                        highlightedUnit = i;
                    };
                };
                if (!drawnBox && selectedUnit === i) {
                    drawSelectionBox(thisUnit, areaX1, areaX2, areaY1, areaY2);
                    highlightedUnit = i;
                };
    
                switch (thisUnit.type) {
                    case "base":
                        ctxMain.beginPath();
                        ctxMain.fillStyle = unitCol;
                        ctxMain.fillRect(thisUnit.x, thisUnit.y, 40, 40);
                        ctxMain.beginPath();
                        ctxMain.fillStyle = '#000000';
                        ctxMain.font = "10px Arial";
                        ctxMain.fillText("Bse", thisUnit.x + 12, thisUnit.y + 25);
                        break;
                    case "wfact":
                        ctxMain.beginPath();
                        ctxMain.fillStyle = unitCol;
                        ctxMain.fillRect(thisUnit.x, thisUnit.y, 80, 30);
                        ctxMain.beginPath();
                        ctxMain.strokeStyle = "#505050";
                        ctxMain.moveTo(thisUnit.x, thisUnit.y);
                        ctxMain.lineTo(thisUnit.x + 80, thisUnit.y + 30);
                        ctxMain.stroke();
                        ctxMain.moveTo(thisUnit.x + 80, thisUnit.y);
                        ctxMain.lineTo(thisUnit.x, thisUnit.y + 30);
                        ctxMain.stroke();
                        ctxMain.beginPath();
                        ctxMain.fillStyle = '#000000';
                        ctxMain.font = "10px Arial";
                        ctxMain.fillText("WAR", thisUnit.x + 27, thisUnit.y + 19);
                        break;
                    case "tower":
                        ctxMain.beginPath();
                        ctxMain.fillStyle = unitCol;
                        ctxMain.fillRect(thisUnit.x, thisUnit.y, 30, 30);
                        ctxMain.beginPath();
                        ctxMain.fillStyle = '#000000';
                        ctxMain.font = "10px Arial";
                        ctxMain.fillText("Twr", thisUnit.x + 7, thisUnit.y + 18);
                        break;
                    case "man":
                        ctxMain.beginPath();
                        ctxMain.fillStyle = unitCol;
                        ctxMain.arc(thisUnit.x, thisUnit.y, 5, 0, 2 * Math.PI, false);
                        ctxMain.fill();
                        break;
                    case "ltank":
                        ctxMain.beginPath();
                        ctxMain.fillStyle = unitCol;
                        ctxMain.arc(thisUnit.x, thisUnit.y, 10, 0, 2 * Math.PI, false);
                        ctxMain.fill();
                        break;
                    case "htank":
                        ctxMain.beginPath();
                        ctxMain.fillStyle = unitCol;
                        ctxMain.arc(thisUnit.x, thisUnit.y, 12, 0, 2 * Math.PI, false);
                        ctxMain.fill();
                        break;
                }
                drawHealthBar(thisUnit);
            } else {
                if (selectedUnit === i) {
                    selectedUnit = -1;
                }
            }
        }

    };

    var getDistance = function(sourceUnit, destUnit) {
        var deltaX = sourceUnit.x - destUnit.x;
        var deltaY = sourceUnit.y - destUnit.y;
        return Math.sqrt(Math.pow(deltaY, 2) + Math.pow(deltaX, 2));
    };

    var mouseHightlightCheck = function(unitSize, unit) {
    };

    var drawHealthBar = function(unit) {
        var perc = (unit.health.areaSizeX / unit.health.max) * unit.health.current;
        ctxMain.fillStyle = getHealthColor(unit);
        ctxMain.fillRect(unit.x + unit.health.barOffsetX, unit.y + unit.health.barOffsetY, perc, 3);
        ctxMain.fillStyle = "#0000aa";
        ctxMain.fillRect(unit.x + perc + unit.health.barOffsetX, unit.y + unit.health.barOffsetY, unit.health.areaSizeX - perc, 3);
    }

    var getHealthBarSize = function(unit, barSize) {
        var perc = (barSize / unit.health.max) * unit.health.current;
        return perc;
    };

    var getHealthColor = function(unit) {
        var perc = (100 / unit.health.max) * unit.health.current;
        if (perc > 70) return "#004400";
        if (perc > 30) return "#444400";
        return "#440000";
    };

    var createUnit = function(startX, startY, unitType, side, unitRole) {
        var newUnit = {
            alive: true,
            role: unitRole,
            x: startX,
            y: startY,
            cx: 0,
            cy: 0,
            circle: false,
            type: unitType,
            health: {
                current: 100,
                max: 100,
                barOffsetX: 0,
                barOffsetY: 0,
                areaSizeX: 0,
                areaSizeY: 0
            },
            aimode: "scan-for-targets",
            move: {
                movable: true,
                x: startX,
                y: startY,
                speed: 0,
                blockX: 0,
                blockY: 0
            },
            owner: side,
            build: {
                builder: false,
                active: false,
                type: null,
                progress: 0,
                target: 0,
                sx: 0,
                sy: 40
            },
            fire: {
                target: null,
                sightRange: 100,
                hitRange: 0,
                hitChance: 0.895,    
                minDamage: 0,
                maxDamage: 0,
                show: false
            }
        };
        switch (unitType) {
            case "base":
                newUnit.health.areaSizeX = 40;
                newUnit.health.areaSizeY = 40;
                newUnit.health.current = 1000;
                newUnit.health.barOffsetX = 0,
                newUnit.health.barOffsetY = -5,
                newUnit.move.movable = false;
                newUnit.build.builder = true;
                newUnit.aiMode = "base";
                newUnit.cx = 19;
                newUnit.cy = 19;
                newUnit.fire.sightRange = 0;
                break;
            case "wfact":
                newUnit.health.areaSizeX = 80;
                newUnit.health.areaSizeY = 30;
                newUnit.health.current = 3400;
                newUnit.health.barOffsetX = 0,
                newUnit.health.barOffsetY = -5,
                newUnit.move.movable = false;
                newUnit.build.builder = true;
                newUnit.aiMode = "base";
                newUnit.cx = 40;
                newUnit.cy = 15;
                newUnit.fire.sightRange = 0;
                break;
            case "tower":
                newUnit.health.areaSizeX = 30;
                newUnit.health.areaSizeY = 30;
                newUnit.health.current = 350;
                newUnit.health.barOffsetX = 0,
                newUnit.health.barOffsetY = -5,
                newUnit.heath
                newUnit.fire.sightRange = 275;
                newUnit.fire.hitRange = 250;
                newUnit.fire.hitChance = 0.920;
                newUnit.fire.minDamage = 5;
                newUnit.fire.maxDamage = 20;
                newUnit.move.movable = false;
                newUnit.cx = 19;
                newUnit.cy = 19;
                break;
            case "man":
                newUnit.circle = true;
                newUnit.health.current = 35;
                newUnit.health.areaSizeX = 10;
                newUnit.health.areaSizeY = 10;
                newUnit.health.barOffsetX = -5,
                newUnit.health.barOffsetY = -10,
                newUnit.move.speed = 2;
                newUnit.fire.sightRange = 150;
                newUnit.fire.hitRange = 60;
                newUnit.fire.minDamage = 2;
                newUnit.fire.maxDamage = 8;
                break;
            case "ltank":
                newUnit.circle = true;
                newUnit.health.current = 300;
                newUnit.health.areaSizeX = 20;
                newUnit.health.areaSizeY = 20;
                newUnit.health.barOffsetX = -10,
                newUnit.health.barOffsetY = -15,
                newUnit.move.speed = 4;
                newUnit.fire.sightRange = 175;
                newUnit.fire.hitRange = 150;
                newUnit.fire.minDamage = 15;
                newUnit.fire.maxDamage = 45;
                newUnit.fire.hitChance = 0.960;
                break;
            case "htank":
                newUnit.circle = true;
                newUnit.health.current = 600;
                newUnit.health.areaSizeX = 22;
                newUnit.health.areaSizeY = 22;
                newUnit.health.barOffsetX = -11,
                newUnit.health.barOffsetY = -16,
                newUnit.move.speed = 1;
                newUnit.fire.sightRange = 120;
                newUnit.fire.hitRange = 100;
                newUnit.fire.minDamage = 30;
                newUnit.fire.maxDamage = 80;
                newUnit.fire.hitChance = 0.982;
                break;
        };
        newUnit.health.max = newUnit.health.current;
        units.push(newUnit);
        return (units.length - 1);
    };

})();
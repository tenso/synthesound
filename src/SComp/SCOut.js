/*global SMix*/
/*global initGIO*/

function SCOut(container) {
    this.out = new SMix();
    
    this.container = container;
    this.classId = "scout";
    this.contId = container.id;
    
    var comp = document.createElement("div"),
        ioport = document.createElement("div");
    
    comp.id = this.classId + "-cont";
    comp.className = "component scout";
    container.appendChild(comp);
    
    initGIO(ioport, this.out, false);
    comp.appendChild(ioport);
}
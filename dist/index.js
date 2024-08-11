class Command {
    constructor(inst, parm) {
        this.instruction = inst;
        this.param = parm;
    }
}
const INSTRUCTIONS = "[<+-.,>]";
class Brainfck {
    constructor(code) {
        this.code = code;
        this.pc = 0;
        this.head = 0;
        this.mem = [];
        this.prog = [];
        this.patch = [];
        this.compile();
    }
    getInstruction(c) {
        if (INSTRUCTIONS.includes(c))
            return c;
        return undefined;
    }
    getNextCommand() {
        const c = this.code.charAt(this.pc);
        switch (c) {
            case "[":
                this.pc++;
                this.patch.push({
                    pos: this.pc,
                    idx: this.prog.length
                });
                return new Command(this.getInstruction(c), 1);
            case "]":
                this.pc++;
                const j = this.patch.pop();
                this.prog[j.idx].param = this.pc;
                return new Command(this.getInstruction(c), j.pos);
            default:
                if (this.getInstruction(c) !== undefined) {
                    this.pc++;
                    let cnt = 1;
                    while (true) {
                        const s = this.code.charAt(this.pc);
                        if (s === c) {
                            this.pc++;
                            cnt++;
                        }
                        else {
                            if (this.getInstruction(s) === undefined) {
                                this.pc++;
                            }
                            else {
                                return new Command(this.getInstruction(c), cnt);
                            }
                        }
                    }
                }
                else {
                    this.pc++;
                }
        }
        return undefined;
    }
    execute() {
        debugger;
    }
    compile() {
        while (this.pc < this.code.length) {
            const cmd = this.getNextCommand();
            if (cmd !== undefined)
                this.prog.push(cmd);
        }
        this.execute();
    }
}
const c = "++++++[>++++++++++<-]>++++++.++++.<+++++[>----<-]>.<+++++[>++<-]>+++++++.<+++++[>----<-]>----..";
const b = new Brainfck(c);

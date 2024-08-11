type Command = {
  instr: string;
  param: number;
}

const INSTRUCTIONS = "[<+-.,>]";

class Brainfck {

  code: string;
  pc: number;
  head: number;
  prog: Command[];
  mem: number[];
  patch: number[];

  constructor(code: string) {
    this.code = code;
    this.pc = 0;
    this.head = 0;
    this.prog = [];
    this.patch = [];

    this.mem = new Array(2 ** 16).fill(0);

    // compile
    while (this.pc < this.code.length) {
      const cmd = this.createCommand();
      if (cmd !== undefined) this.prog.push(cmd);
    }

    this.execute();
  }

  isInstruction(c: string): boolean {
    return INSTRUCTIONS.includes(c);
  }

  createCommand(): Command {
    const c = this.code.charAt(this.pc++);

    switch (c) {
      case "[":
        this.patch.push(this.prog.length + 1);
        return { instr: c, param: 0xbadf00d };

      case "]":
        const j = this.patch.pop();
        this.prog[j - 1].param = this.prog.length + 1;
        return { instr: c, param: j };

      default:
        if (this.isInstruction(c)) {
          let cnt = 1;

          while (true) {
            const s = this.code.charAt(this.pc);

            if (!this.isInstruction(s) || s !== c) {
              return { instr: c, param: cnt };
            }
            cnt++;
            this.pc++;
          }
        }
    }

    return undefined;
  }

  execute(): void {
    let progIdx = 0;
    while (progIdx < this.prog.length) {
      const cmd = this.prog[progIdx];

      switch (cmd.instr) {
        case "+":
          this.mem[this.head] += cmd.param;
          break;
        case "-":
          this.mem[this.head] -= cmd.param;
          break;
        case ">":
          this.head += cmd.param;
          break;
        case "<":
          this.head -= cmd.param;
          break;
        case ".":
          for (let i = 0; i < cmd.param; i++)
            console.log(this.mem[this.head]);
          break;
        case ",":
          let c: string;
          for (let i = 0; i < cmd.param; i++) {
            c = prompt("Enter a value:");
            this.mem[this.head] = c.charCodeAt(0);
          }
          break;
        case "[":
          if (this.mem[this.head] === 0) {
            progIdx = cmd.param;
            continue;
          }
          break;
        case "]":
          if (this.mem[this.head] !== 0) {
            progIdx = cmd.param;
            continue;
          }
          break;
      }

      progIdx++;
    }
  }
}

const c = "++++++[>++++++++++<-]>++++++.++++.<+++++[>----<-]>.<+++++[>++<-]>+++++++.<+++++[>----<-]>----..";
const b = new Brainfck(c);
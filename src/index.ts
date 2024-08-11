enum Cmd {
  NOP = "",
  INC_MEM = "+",
  DEC_MEM = "-",
  INC_HEAD = ">",
  DEC_HEAD = "<",
  OUTPUT = ".",
  INPUT = ",",
  JPZ = "[",
  JPNZ = "]"
}

type Instruction = Cmd | undefined;

interface Jump {
  pos: number;
  idx: number;
}

class Command {
  instruction: Instruction;
  param: number;

  constructor(inst: Instruction, parm: number) {
    this.instruction = inst;
    this.param = parm;
  }
}

class Brainfck {

  code: string;
  pc: number;
  head: number;
  prog: Command[];
  mem: number[];
  patch: Jump[];

  constructor(code: string) {
    this.code = code;
    this.pc = 0;
    this.head = 0;
    this.mem = [];
    this.prog = [];
    this.patch = [];

    this.compile();
  }

  getInstruction(c: string): Instruction {
    // Iterate over all enum values
    for (const key in Cmd) {
      if (Cmd[key as keyof typeof Cmd] === c) {
        return Cmd[key as keyof typeof Cmd];
      }
    }
    // Return undefined if no match is found
    return undefined;
  }

  getNextCommand(): Command | undefined {

    const c = this.code.charAt(this.pc);

    switch (c) {
      case "[":
        this.pc++;
        // add jump address to stack
        this.patch.push({
          pos: this.pc,
          idx: this.prog.length
        });

        return new Command(this.getInstruction(c), 1);

      case "]":
        this.pc++;
        // pop address and patch the jump
        const j = this.patch.pop();
        this.prog[j.idx].param = this.pc;

        return new Command(this.getInstruction(c), j.pos);

      default:
        if (this.getInstruction(c) !== undefined) {
          // this is real instruction
          this.pc++;
          let cnt = 1;

          // count instructions amount
          while (true) {
            const s = this.code.charAt(this.pc);

            // if next instruction is equals to the first
            // add count and advance prog counter
            if (s === c) {
              this.pc++;
              cnt++;

            } else {

              // if instruction is undefined just advance prog counter
              if (this.getInstruction(s) === undefined) {
                this.pc++;

              } else {
                // if next instruction is different from the first one
                // return a new Command
                return new Command(this.getInstruction(c), cnt);

              }
            }
          }

        } else {
          // instruction in pc is undefinde - goto next
          this.pc++;

        }
    }

    return undefined;
  }

  execute(): void {
    debugger
  }

  compile(): void {
    while (this.pc < this.code.length) {
      const cmd = this.getNextCommand();
      if (cmd !== undefined) this.prog.push(cmd);
    }

    this.execute();
  }

}

const c = "++++++[>++++++++++<-]>++++++.++++.<+++++[>----<-]>.<+++++[>++<-]>+++++++.<+++++[>----<-]>----..";
//const c = "++er ++ ++[>++<] test +"
const b = new Brainfck(c);
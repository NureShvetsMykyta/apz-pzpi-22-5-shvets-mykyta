// інтерфейс
public interface Command { void execute(); }

// команда вмикання світла
public class LightOn implements Command {
  private LightReceiver recv;
  public LightOn(LightReceiver r){ recv = r; }
  public void execute(){ recv.turnOn(); }
}

// команда вимикання світла
public class LightOff implements Command {
  private LightReceiver recv;
  public LightOff(LightReceiver r){ recv = r; }
  public void execute(){ recv.turnOff(); }
}

// команда з undo
interface Undoable { void execute(); void undo(); }

class TextCmd implements Undoable {
  private StringBuilder doc;
  private String text;
  public TextCmd(StringBuilder d, String t){ doc=d; text=t; }
  public void execute(){ doc.append(text); }
  public void undo(){ doc.delete(doc.length()-text.length(), doc.length()); }
}

// менеджер команд
class UndoMgr {
  private Stack&lt;Undoable&gt; history = new Stack<>();
  void exec(Undoable c){ c.execute(); history.push(c); }
  void undo(){ if(!history.isEmpty()) history.pop().undo(); }
}

// макрокоманда об’єднує кілька команд
class MacroCmd implements Command {
  private List&lt;Command&gt; cmds = new ArrayList<>();
  void add(Command c){ cmds.add(c); }
  public void execute(){ for(Command c: cmds) c.execute(); }
}

// приклад
RemoteControl rc = new RemoteControl();
MacroCmd party = new MacroCmd();
party.add(new LightOn(receiver));
party.add(new LightOff(receiver));
rc.setCommand(party);
rc.invoke();

// логуюча обгортка
class LogCmd implements Command {
  private Command cmd;
  public LogCmd(Command c){ cmd=c; }
  public void execute(){
    System.out.println("Лог: "+cmd.getClass().getSimpleName());
    cmd.execute();
  }
}

// черга виконання
class CmdQueue {
  private Queue&lt;Command&gt; q = new LinkedList<>();
  void add(Command c){ q.add(c); }
  void runAll(){ while(!q.isEmpty()) q.poll().execute(); }
}

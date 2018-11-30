--From Jalepeno Web site to computer writing or flashing EEPROMs
--during flashing, make sure it is registered to a user otherwise it fails.

--this is example of generated EEPROMS
registeredTo="rjs232323";
password=nil;
serverAddress="192.168.1.45";--"75.120.137.11";
i=component.proxy(component.list("internet") ());

local con= i.connect(serverAddress, 50001)  
local env=_ENV;

function os.sleep(timeout)

  local deadline = computer.uptime() + (timeout or 0)
  repeat
    computer.pullSignal(deadline - computer.uptime())
  until computer.uptime() >= deadline
end

function print_r ( t )  
    local print_r_cache={}
    local function sub_print_r(t,indent)
        if (print_r_cache[tostring(t)]) then
            print(indent.."*"..tostring(t))
        else
            print_r_cache[tostring(t)]=true
            if (type(t)=="table") then
                for pos,val in pairs(t) do
                    if (type(val)=="table") then
                        print(indent.."["..pos.."] => "..tostring(t).." {")
                        sub_print_r(val,indent..string.rep(" ",string.len(pos)+8))
                        print(indent..string.rep(" ",string.len(pos)+6).."}")
                    elseif (type(val)=="string") then
                        print(indent.."["..pos..'] => "'..val..'"')
                    else
                        print(indent.."["..pos.."] => "..tostring(val))
                    end
                end
            else
                print(indent..tostring(t))
            end
        end
    end
    if (type(t)=="table") then
        print(tostring(t).." {")
        sub_print_r(t,"  ")
        print("}")
    else
        sub_print_r(t,"  ")
    end
end

env.print=function(...) 
if type(...) =="table" then
  print_r(...);
elseif type(...)=="function" then
bufferingString=bufferingString..(""..string.dump((...)or"").."\n\r");
else
bufferingString=bufferingString..(""..((...)or"").."\n\r");
end
end

previousSLP="SLP"
function sendBackMsg(msg)
if previousSLP==msg then return; end
if msg==nil then msg="nil" end;
con.write(msg.."\n\r");
previousSLP=msg;
end
function sendBackErr(err)
if not err then return; end
bufferingString=bufferingString..("Error:"..(err).."\n\r");
end
local endCode="SLP";
function setBackEndCode(code)--always 3 character
endCode=code;
end


function readLineBool()
 local  dataLine=con.read();
 if dataLine==nil then return false end;
	bufferingString=""
	 if con and dataLine then
		 local f,err=load(dataLine,nil,"t",env);
		 if f then
			 local success, err, ret=xpcall (f,sendBackErr);
			 if not success then sendBackErr(err); end
		 else
		   sendBackErr(err);
		 end
		 sendBackMsg(bufferingString..endCode);
		 return true;
	else
		return false;
	end
end
bufferingString="";
function login() 
	setBackEndCode("LGN");
	bufferingString=bufferingString..("a="..computer.address()).."\n\r";
	bufferingString=bufferingString..("u="..computer.address()..","..registeredTo).."\n\r";
	if password then --dont let someone else hijack your baby!
		bufferingString=bufferingString..("p="..password).."\n\r";
	end
	sendBackMsg(bufferingString.."LGN");
end
login();
io={};
io.read=login; --just a hack to get around my flaw quickly
local closed=false;
repeat
os.sleep(0.25);
 local counter=0;
 local r=false;
   repeat 
		r= readLineBool()
        if not r then counter=counter+1; end
  until (r) or (counter>=4 and not r);
  if not r then os.sleep(5); computer.beep(95,0.1); con.close(); con= i.connect(serverAddress, 50001); login()   end;
  endCode="SLP";
until closed;
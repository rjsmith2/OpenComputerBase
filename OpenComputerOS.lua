local internet = require("internet")  
local serial=require("serialization");
local fs = require("filesystem");
local component=require("component");
local con= internet.open("192.168.1.45",50001);
_ENV.OldPrint=_ENV.print;
local env=_ENV;

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
    print()
end
env.print=function(...)
if not (...) then return; end
if type(...) =="table" then
con:write(""..serial.serialize(print_r(...)or"").."\n\r");
elseif type(...)=="function" then
con:write(""..string.dump((...)or"").."\n\r");
else
con:write(""..((...)or"").."\n\r");
end

_ENV.OldPrint(...);
end
function sendBackMsg(msg)
con:write(msg.."\n\r");
end
function sendBackErr(err)
if not err then return; end
con:write("Error:"..(err).."\n\r");
end
local endCode="SLP";
function setBackEndCode(code)--always 3 character
endCode=code;
end

function writeToFile(fileName,data)
   local hWrite = io.open(fileName, "w")
   hWrite:write(data)
   hWrite:close()
  
end
function getFile(fileName)
  local file = io.open(fileName,'r')
  local data = file:read("*all")
  file:close();
  return data;
end

function readLineBool()
 local  dataLine=con:read();
	 if con and dataLine then
		 local f,err=load(dataLine,nil,"t",env);
		 if f then
			 local success, err, ret=xpcall (f,sendBackErr);
			 if not success then sendBackErr(err); end
		 else
		   sendBackErr(err);
		 end
		 sendBackMsg(endCode);
		 return true;
	else
		return false;
	end
end

--lets login to let Jalep know its on, baby!
if fs.exists("Jalopeno.ini") then
print("LOGGING INTO JALOPENO SERVICE");
local data=serial.unserialize(getFile("Jalopeno.ini"));
sendBackMsg("a="..component.computer.address);
sendBackMsg("u="..data.username);
if data.password then --dont let someone else hijack your baby!
	sendBackMsg("p="..data.password);
end
sendBackMsg("LGN");
end
local closed=false;
repeat
 os.sleep(0.25);
 local counter=0;
 local r=false;
   repeat 
		r= readLineBool()
        if not r then counter=counter+1; end
  until (r) or (counter>=4 and not r);
  if not r then con:close(); closed=true; print("Error: no server reply, closing"); end;
  endCode="SLP";
until closed;